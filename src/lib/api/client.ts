import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to add JWT Auth Header
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("pathfind_access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("pathfind_refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("pathfind_access_token", newAccessToken);

          if (response.data.refresh) {
             localStorage.setItem("pathfind_refresh_token", response.data.refresh);
          }

          apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest); // retry the original request
        }
      } catch (refreshError) {
        // Refresh failed, log user out
        if (typeof window !== "undefined") {
          localStorage.removeItem("pathfind_access_token");
          localStorage.removeItem("pathfind_refresh_token");
          // Optionally redirect to login page here, or handle in the UI store
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
      }
    }

    return Promise.reject(error);
  }
);
