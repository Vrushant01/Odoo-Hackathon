import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to dynamically attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to unwrap success payloads and handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("transitops_token");
      sessionStorage.removeItem("transitops_token");
      if (!window.location.pathname.endsWith("/login")) {
        window.location.href = "/login";
      }
    }
    
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      "An unexpected error occurred.";
      
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
