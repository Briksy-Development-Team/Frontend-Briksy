import axios from "axios";
import { getStoredAuth } from "../auth/auth.storage";

export type ApiPage<T> = {
  success: boolean;
  data: T[];
  meta?: {
    pagination?: { total: number; last_page: number; current_page: number };
  };
};

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

const API_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// console.log("API URL:", import.meta.env.VITE_APP_API_URL);
api.interceptors.request.use((config) => {
  const auth = getStoredAuth();

  if (auth?.token) {
    config.headers = config.headers ?? {};
    const tokenType = auth.tokenType || "Bearer";
    (config.headers as Record<string, string>).Authorization =
      `${tokenType} ${auth.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const contentType = String(response.headers?.["content-type"] ?? "").toLowerCase();
    const bodyIsHtml = typeof response.data === "string" && /<!doctype html|<html[\s>]/i.test(response.data);

    if (contentType.includes("text/html") || bodyIsHtml) {
      return Promise.reject(new Error(
        "The API request returned the Briksy website HTML instead of JSON. Route /api/* to the Laravel backend or set VITE_APP_API_URL to the Laravel API base (including /api).",
      ));
    }

    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? "");
    const hasBearerAuth = Boolean(error?.config?.headers?.Authorization);

    const isSeekerAuthFailure =
      status === 401 &&
      hasBearerAuth &&
      (requestUrl.startsWith("/seeker/auth/me") ||
        requestUrl.startsWith("/seeker/auth/logout") ||
        requestUrl.startsWith("/seeker/favorites") ||
        requestUrl.startsWith("/seeker/inquiries") ||
        requestUrl.startsWith("/seeker/profile") ||
        requestUrl.startsWith("/seeker/saved-searches")) &&
      !requestUrl.includes("/seeker/auth/login") &&
      !requestUrl.includes("/seeker/auth/register");

    if (isSeekerAuthFailure && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("briksy:seeker-auth-unauthorized", {
          detail: { url: requestUrl },
        }),
      );
    }

    return Promise.reject(error);
  },
);

export const testConnection = async () => {
  try {
    const res = await api.get("/");

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
