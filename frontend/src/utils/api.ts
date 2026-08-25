import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  // baseURL: API_BASE_URL,
  baseURL : "http://localhost:8000",
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

interface BackendErrorResponse {
  success?: boolean;
  message?: string;
  error?: {
    message?: string;
    code?: string;
  };
}

/**
 * ============================================================
 * ERROR MESSAGE EXTRACTOR
 * ============================================================
 *
 * Handles:
 *
 * JSON:
 * {
 *   success: false,
 *   message: "No vehicles are ready for auction."
 * }
 *
 * HTML:
 * <pre>Error: No vehicles are ready for auction.<br>...</pre>
 *
 * Network errors
 * Timeout errors
 */

const extractErrorMessage = (
  error: AxiosError<BackendErrorResponse | string>,
): string => {
  /**
   * ----------------------------------------------------------
   * No response from server
   * ----------------------------------------------------------
   */

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }

    if (error.code === "ERR_NETWORK") {
      return "Unable to connect to the server. Please check your internet connection.";
    }

    return error.message || "Unable to connect to the server.";
  }

  const data = error.response.data;

  /**
   * ----------------------------------------------------------
   * Backend returned JSON
   * ----------------------------------------------------------
   */

  if (data && typeof data === "object") {
    return (
      data.message ||
      data.error?.message ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }

  /**
   * ----------------------------------------------------------
   * Backend returned HTML
   * ----------------------------------------------------------
   */

  if (typeof data === "string") {
    /**
     * Example:
     *
     * <pre>Error: No vehicles are ready for auction.<br>
     *     at AuctionService...
     * </pre>
     */

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

      /**
       * Remove stack trace.
       *
       * Example:
       *
       * Error: No vehicles are ready for auction.
       *     at AuctionService.createAuction(...)
       *     at ...
       *
       * We only want:
       *
       * No vehicles are ready for auction.
       */

      const firstLine = message
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line.length > 0);

      if (firstLine) {
        return firstLine.replace(/^Error:\s*/i, "").trim();
      }
    }

    /**
     * If HTML doesn't contain <pre>
     */

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

/**
 * ============================================================
 * AUTH ROUTES
 * ============================================================
 *
 * We should NEVER automatically refresh token for these
 * endpoints.
 */

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

/**
 * ============================================================
 * REFRESH STATE
 * ============================================================
 */

let isRefreshing = false;

type FailedRequest = {
  resolve: () => void;
  reject: (error: AxiosError) => void;
};

let failedQueue: FailedRequest[] = [];

/**
 * ============================================================
 * PROCESS FAILED REQUEST QUEUE
 * ============================================================
 */

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

/**
 * ============================================================
 * RESPONSE INTERCEPTOR
 * ============================================================
 *
 * Handles:
 *
 * 1. Normal responses
 * 2. Error extraction
 * 3. 401 token refresh
 * 4. Multiple simultaneous 401 requests
 */

api.interceptors.response.use(
  /**
   * ----------------------------------------------------------
   * SUCCESS
   * ----------------------------------------------------------
   */

  (response) => {
    return response;
  },

  /**
   * ----------------------------------------------------------
   * ERROR
   * ----------------------------------------------------------
   */

  async (error: AxiosError<BackendErrorResponse | string>) => {
    console.error("========== API ERROR ==========");
    console.error("URL:", error.config?.url);
    console.error("Method:", error.config?.method);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("================================");

    /**
     * Extract clean backend error message
     */

    const cleanMessage = extractErrorMessage(error);

    /**
     * Store clean message on Axios error
     */

    error.message = cleanMessage;

    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    /**
     * --------------------------------------------------------
     * No request config
     * --------------------------------------------------------
     */

    if (!originalRequest) {
      return Promise.reject(error);
    }

    /**
     * --------------------------------------------------------
     * Only handle 401
     * --------------------------------------------------------
     */

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    /**
     * --------------------------------------------------------
     * DO NOT REFRESH AUTH ROUTES
     * --------------------------------------------------------
     *
     * Especially:
     *
     * /api/auth/login
     * /api/auth/signup
     * /api/auth/refresh
     */

    if (isAuthRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    /**
     * --------------------------------------------------------
     * DON'T RETRY SAME REQUEST TWICE
     * --------------------------------------------------------
     */

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * --------------------------------------------------------
     * IF REFRESH IS ALREADY RUNNING
     * --------------------------------------------------------
     *
     * Put this request into queue.
     */

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

    /**
     * --------------------------------------------------------
     * START TOKEN REFRESH
     * --------------------------------------------------------
     */

    isRefreshing = true;

    try {
      console.log("Access token expired. Refreshing token...");

      /**
       * IMPORTANT:
       *
       * Refresh token is HttpOnly.
       *
       * We DO NOT read it from localStorage.
       *
       * Browser automatically sends cookie because:
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

      /**
       * ------------------------------------------------------
       * Tell all waiting requests that refresh succeeded
       * ------------------------------------------------------
       */

      processQueue(null);

      /**
       * ------------------------------------------------------
       * Retry original request
       * ------------------------------------------------------
       */

      return api(originalRequest);
    } catch (refreshError) {
      console.error("Refresh token failed:", refreshError);
      const axiosRefreshError = refreshError as AxiosError<
        BackendErrorResponse | string
      >;
      processQueue(axiosRefreshError);

      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }

      return Promise.reject(axiosRefreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
