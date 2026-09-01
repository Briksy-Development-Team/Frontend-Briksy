import axios from "axios";
import { getStoredAuth } from "../auth/auth.storage";

const API_URL = import.meta.env.VITE_APP_API_URL ;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  (response) => response,
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
