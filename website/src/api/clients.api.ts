import axios from "axios";
import { getStoredAuth } from "../auth/auth.storage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

export const testConnection = async () => {
  try {
    const res = await api.get("/health-check");

    if (res.status === 200) {
      console.log("Backend connected successfully ");
    } else {
      console.log("Backend responded but status:", res.status);
    }
  } catch (error) {
    console.error("Backend connection failed ", error);
  }
};

export default api;
