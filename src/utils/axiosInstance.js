import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Guard for SSR / non-browser environments
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        // CRITICAL FIX: Use backticks `` not single quotes ''
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptors
axiosInstance.interceptors.response.use(
  (response) => response, // FIXED: Typo "resposne"
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized: redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } else if (status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") { // FIXED: Typo "ECONNARORTED"
      console.warn("Request timeout. Please try again later.");
    } else {
      console.error("An unexpected error occurred:", error.message || error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;