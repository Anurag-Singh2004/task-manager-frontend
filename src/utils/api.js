import axios from "axios";
import { tokenStore } from "./tokenStore";

// ── Create axios instance with base config ──
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ─────────────
// Runs BEFORE every request is sent
// Automatically attaches token if it exists

api.interceptors.request.use(
  (config) => {
    const token = tokenStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ─────────
// Runs AFTER every response comes back
// We'll add token refresh logic here in Phase 2

api.interceptors.response.use(
  (response) => response, // success — just return it
  async (error) => {
    const originalRequest = error.config;

    // 401 = token expired AND we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry){
      originalRequest._retry = true; // prevent infinite loop

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        // No refresh token → force logout
        if (!refreshToken) {
          tokenStore.clearToken();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Get new accessToken
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken },
        );
        const newToken = res.data.accessToken;

        // Save new token to bridge
        tokenStore.setToken(newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → force logout
        tokenStore.clearToken();
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
      return Promise.reject(error);
  },
);

export default api;