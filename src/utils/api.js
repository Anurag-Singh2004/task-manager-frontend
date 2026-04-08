import axios from "axios";

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
    const token = localStorage.getItem("accessToken");
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
  (error) => {
    // For now just reject — we'll handle 401 in Phase 2
    return Promise.reject(error);
  },
);

export default api;