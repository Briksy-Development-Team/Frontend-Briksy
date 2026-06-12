import api from "../../../services/api/axiosInstance";
import { getAuth } from "./AuthHelpers";
import type { AuthResponse, UserModel } from "./_models";

type AdminAuthEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AdminAuthPayload = {
  first: string;
  last: string;
  name?: string;

  email: string;
  password: string;
  password_confirmation: string;
};

export async function login(email: string, password: string) {
  const payload = { email, password };

  try {
    const response = await api.post<AdminAuthEnvelope<AuthResponse>>(
      "/super-admin/auth/login",
      payload,
    );

    return response.data;
  } catch (error) {
    const response = await api.post<AdminAuthEnvelope<AuthResponse>>(
      "/admin/auth/login",
      payload,
    );

    return response.data;
  }
}

export async function register(payload: AdminAuthPayload) {
  const response = await api.post<AdminAuthEnvelope<AuthResponse>>(
    "/admin/auth/register",
    payload,
  );

  return response.data;
}

export async function getUserByToken() {
  const auth = getAuth();
  const basePath = auth?.abilities?.includes("super_admin")
    ? "/super-admin"
    : "/admin";
  const response =
    await api.get<AdminAuthEnvelope<{ user: UserModel }>>(`${basePath}/auth/me`);

  return response.data;
}

export async function getPermissionsByToken() {
  const response = await api.get<AdminAuthEnvelope<{
    effective_permission_names: string[];
    grouped: Array<{ module: string; permissions: Array<Record<string, unknown>> }>;
  }>>("/me/permissions");

  return response.data;
}

export async function logout() {
  const auth = getAuth();
  const basePath = auth?.abilities?.includes("super_admin")
    ? "/super-admin"
    : "/admin";
  const response =
    await api.post<AdminAuthEnvelope<unknown>>(`${basePath}/auth/logout`);

  return response.data;
}

export async function requestPassword(email: string) {
  return api.post("/admin/auth/forgot-password", {
    email,
  });
}
