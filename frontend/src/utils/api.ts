import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
// process.env.NEXT_PUBLIC_API_URL
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,

  timeout: 60000,
});

let isRefreshing = false;

let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(true);
    }
  });

  failedQueue = [];
};
const isAuthRoute = (url?: string) => {
  if (!url) return false;

  return (
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/signup") ||
    url.includes("/api/auth/register") ||
    url.includes("/api/auth/verify") ||
    url.includes("/api/auth/refresh") ||
    url.includes("/api/auth/logout")
  );
};
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    // No request config
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ==================================================
    // DO NOT TRY REFRESH FOR AUTH ROUTES
    // ==================================================

    if (isAuthRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    // ==================================================
    // DON'T RETRY SAME REQUEST TWICE
    // ==================================================

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // ==================================================
    // IF REFRESH IS ALREADY RUNNING
    // WAIT FOR IT
    // ==================================================

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then(() => {
        return api(originalRequest);
      });
    }

    // ==================================================
    // START REFRESH
    // ==================================================

    isRefreshing = true;

    try {
      console.log("Access token expired. Refreshing token...");

      /*
       * IMPORTANT:
       *
       * refreshToken is HttpOnly.
       * We DON'T read it from localStorage.
       * Browser automatically sends it as a cookie.
       */

      await api.post(
        "/api/auth/refresh",
        {},
        {
          withCredentials: true,
        },
      );

      console.log("Token refreshed successfully");

      // =================================================
      // NEW ACCESS TOKEN + REFRESH TOKEN ARE NOW
      // STORED BY THE BROWSER THROUGH Set-Cookie
      // =================================================

      processQueue(null);

      // =================================================
      // RETRY ORIGINAL REQUEST
      // =================================================

      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "Refresh token failed:",
        refreshError,
      );

      // Tell all waiting requests that refresh failed
      processQueue(refreshError as AxiosError);

      // =================================================
      // REFRESH TOKEN IS ALSO EXPIRED/INVALID
      // USER MUST LOGIN AGAIN
      // =================================================

      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;