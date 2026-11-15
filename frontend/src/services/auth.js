import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to API requests
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Register user
export const registerUser = async (userData) => {
  const response = await API.post("/api/auth/register", userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await API.post("/api/auth/login", credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await API.get("/api/auth/me");
  return response.data;
};

export default API;
