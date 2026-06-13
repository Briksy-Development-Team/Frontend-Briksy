import axios from "axios";
import { getAuth } from "../../modules/auth/core/AuthHelpers";

const LOOPBACK_HOST_PATTERN = /(^|:\/\/)(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i;

const getLocalApiBaseUrl = (origin: string) => {
  const url = new URL(origin);
  const hostname = url.hostname === "0.0.0.0" ? "localhost" : url.hostname;

  return `${url.protocol}//${hostname}:8000/api`;
};

const resolveApiBaseUrl = () => {
  const configured = import.meta.env.VITE_APP_API_URL?.trim();

  if (configured && !LOOPBACK_HOST_PATTERN.test(configured)) {
    return configured.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const origin = window.location.origin.replace(/\/$/, "");

    if (LOOPBACK_HOST_PATTERN.test(origin)) {
      return getLocalApiBaseUrl(origin);
    }

    return "/api";
  }

  return "/api";
};

const axiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const auth = getAuth();

  if (auth?.api_token) {
    config.headers.Authorization = `Bearer ${auth.api_token}`;
  }

  return config;
});

export default axiosInstance;
