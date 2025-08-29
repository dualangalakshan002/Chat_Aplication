import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5002/api",
  withCredentials: true, // optional, if backend uses cookies
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
