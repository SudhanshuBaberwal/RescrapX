import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
// process.env.NEXT_PUBLIC_API_URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem("token");
      window.location.href = "/login"; // Hard redirect clears loop memory
    }
    return Promise.reject(error);
  },
);

// let isRefreshing = false;

// let failedQueue: {
//   resolve: (value?: unknown) => void;
//   reject: (reason?: any) => void;
// }[] = [];

// const processQueue = (error?: AxiosError) => {
//   failedQueue.forEach((promise) => {
//     if (error) promise.reject(error);
//     else promise.resolve(true);
//   });

//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,

//   async (error: AxiosError) => {
//     const originalRequest = error.config as
//       | (InternalAxiosRequestConfig & { _retry?: boolean })
//       | undefined;

//     if (!originalRequest) {
//       return Promise.reject(error);
//     }

//     // ❌ Refresh endpoint fail hua to dobara refresh mat karo
//     if (originalRequest.url?.includes("/api/auth/refresh")) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status !== 401) {
//       return Promise.reject(error);
//     }

//     if (originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then(() => api(originalRequest));
//     }

//     isRefreshing = true;

//     try {
//       // Refresh token cookie automatically jayegi
//       await api.post("/api/auth/refresh");

//       processQueue();

//       // Retry original request
//       return api(originalRequest);
//     } catch (refreshError) {
//       processQueue(refreshError as AxiosError);

//       if (typeof window !== "undefined") {
//         window.location.replace("/login");
//       }

//       return Promise.reject(refreshError);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

export default api;
