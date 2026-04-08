import api from "../../../services/api/axiosInstance";
import type { AuthResponse, UserModel } from "./_models";

type AdminAuthEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AdminAuthPayload = {
  first: string;
  last: string;

  email: string;
  password: string;
  password_confirmation: string;
};

export async function login(email: string, password: string) {
  const response = await api.post<AdminAuthEnvelope<AuthResponse>>(
    "/admin/auth/login",
    {
      email,
      password,
    },
  );

  return response.data;
}

export async function register(payload: AdminAuthPayload) {
  const response = await api.post<AdminAuthEnvelope<AuthResponse>>(
    "/admin/auth/register",
    payload,
  );

  return response.data;
}

export async function getUserByToken() {
  const response =
    await api.get<AdminAuthEnvelope<{ user: UserModel }>>("/admin/auth/me");

  return response.data;
}

export async function logout() {
  const response =
    await api.post<AdminAuthEnvelope<unknown>>("/admin/auth/logout");

  return response.data;
}

export async function requestPassword(email: string) {
  return api.post("/admin/auth/forgot-password", {
    email,
  });
}
