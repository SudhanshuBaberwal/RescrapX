import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  // baseURL : "http://localhost:8000",
  withCredentials: true,
  timeout: 60000,
  
});

/* ============================================================
   TYPES
============================================================ */

interface BackendErrorResponse {
  success?: boolean;
  message?: string;
  error?: {
    message?: string;
    code?: string;
  };
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/* ============================================================
   ERROR MESSAGE EXTRACTOR
============================================================ */

const extractErrorMessage = (
  error: AxiosError<BackendErrorResponse | string>,
): string => {
  /* ----------------------------------------------------------
     No response from server
  ---------------------------------------------------------- */

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }

    if (
      error.code === "ERR_NETWORK" ||
      error.code === "ERR_NETWORK_CHANGED"
    ) {
      return "Unable to connect to the server. Please check your internet connection.";
    }

    return error.message || "Unable to connect to the server.";
  }

  const data = error.response.data;

  /* ----------------------------------------------------------
     JSON error
  ---------------------------------------------------------- */

  if (data && typeof data === "object") {
    return (
      data.message ||
      data.error?.message ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }

  /* ----------------------------------------------------------
     HTML error
  ---------------------------------------------------------- */

  if (typeof data === "string") {
    const preMatch = data.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);

    if (preMatch?.[1]) {
      let message = preMatch[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .trim();

      const firstLine = message
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line.length > 0);

      if (firstLine) {
        return firstLine.replace(/^Error:\s*/i, "").trim();
      }
    }

    const cleanText = data
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleanText) {
      return cleanText;
    }
  }

  return error.message || "Something went wrong. Please try again.";
};

/* ============================================================
   AUTH ROUTES
============================================================ */

const isAuthRoute = (url?: string): boolean => {
  if (!url) return false;

  const authRoutes = [
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/register",
    "/api/auth/verify",
    "/api/auth/refresh",
    "/api/auth/logout",
  ];

  return authRoutes.some((route) => url.includes(route));
};

/* ============================================================
   AUTH ME ROUTE
============================================================ */

const isMeRoute = (url?: string): boolean => {
  if (!url) return false;

  return (
    url.includes("/api/auth/me") ||
    url.endsWith("/auth/me")
  );
};

/* ============================================================
   REFRESH STATE
============================================================ */

let isRefreshing = false;

type FailedRequest = {
  resolve: () => void;
  reject: (error: AxiosError) => void;
};

let failedQueue: FailedRequest[] = [];

/* ============================================================
   PROCESS QUEUE
============================================================ */

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

/* ============================================================
   RESPONSE INTERCEPTOR
============================================================ */

api.interceptors.response.use(
  /* ----------------------------------------------------------
     SUCCESS
  ---------------------------------------------------------- */

  (response) => {
    return response;
  },

  /* ----------------------------------------------------------
     ERROR
  ---------------------------------------------------------- */

  async (
    error: AxiosError<BackendErrorResponse | string>,
  ) => {
    const url = error.config?.url || "";

    const status = error.response?.status;

    const meEndpoint = isMeRoute(url);

    /* --------------------------------------------------------
       LOG API ERROR

       Don't spam console for /auth/me 401.
       A 401 from /auth/me simply means the user is not logged in.
    -------------------------------------------------------- */

    if (!(status === 401 && meEndpoint)) {
      console.error("========== API ERROR ==========");
      console.error("URL:", url);
      console.error("Method:", error.config?.method);
      console.error("Status:", status);
      console.error("Data:", error.response?.data);
      console.error("Message:", error.message);
      console.error("================================");
    }

    /* --------------------------------------------------------
       Extract clean backend message
    -------------------------------------------------------- */

    error.message = extractErrorMessage(error);

    const originalRequest =
      error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    /* ========================================================
       IMPORTANT

       /auth/me 401 is NOT a fatal authentication error.

       It simply means:
       "There is currently no authenticated user."

       DO NOT refresh.
       DO NOT redirect.
    ======================================================== */

    if (status === 401 && meEndpoint) {
      return Promise.reject(error);
    }

    /* --------------------------------------------------------
       Only handle 401 from protected APIs
    -------------------------------------------------------- */

    if (status !== 401) {
      return Promise.reject(error);
    }

    /* --------------------------------------------------------
       Never refresh auth routes
    -------------------------------------------------------- */

    if (isAuthRoute(url)) {
      return Promise.reject(error);
    }

    /* --------------------------------------------------------
       Don't retry same request twice
    -------------------------------------------------------- */

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /* ========================================================
       REFRESH ALREADY RUNNING
    ======================================================== */

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then(() => {
        return api(originalRequest);
      });
    }

    /* ========================================================
       START REFRESH
    ======================================================== */

    isRefreshing = true;

    try {
      console.log("Access token expired. Refreshing token...");

      /*
       * Refresh token is HttpOnly.
       *
       * We don't access it from JavaScript.
       *
       * Browser sends it automatically because:
       *
       * withCredentials: true
       */

      await api.post(
        "/api/auth/refresh",
        {},
        {
          withCredentials: true,
        },
      );

      console.log("Token refreshed successfully");

      /* ------------------------------------------------------
         Refresh successful
      ------------------------------------------------------ */

      processQueue(null);

      /* ------------------------------------------------------
         Retry original request
      ------------------------------------------------------ */

      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "Refresh token failed:",
        refreshError,
      );

      const axiosRefreshError =
        refreshError as AxiosError<
          BackendErrorResponse | string
        >;

      /* ------------------------------------------------------
         Reject all queued requests
      ------------------------------------------------------ */

      processQueue(axiosRefreshError);

      /* ------------------------------------------------------
         Refresh really failed.

         NOW redirect to login.

         /auth/me is already handled above, so it will
         NEVER reach this block.
      ------------------------------------------------------ */

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.replace("/login");
      }

      return Promise.reject(axiosRefreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;