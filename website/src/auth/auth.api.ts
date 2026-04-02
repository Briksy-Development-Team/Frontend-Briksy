import api from "../api/clients.api";
import type {
  ApiEnvelope,
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "./auth.types";

export const registerSeeker = async (
  payload: RegisterPayload
): Promise<ApiEnvelope<AuthUser>> => {
  const response = await api.post<ApiEnvelope<AuthUser>>(
    "/seeker/auth/register",
    payload
  );

  return response.data;
};

export const loginSeeker = async (
  payload: LoginPayload
): Promise<ApiEnvelope<AuthResponse>> => {
  const response = await api.post<ApiEnvelope<AuthResponse>>(
    "/seeker/auth/login",
    payload
  );

  return response.data;
};

export const getSeekerProfile = async (): Promise<ApiEnvelope<{ user: AuthUser }>> => {
  const response = await api.get<ApiEnvelope<{ user: AuthUser }>>("/seeker/auth/me");

  return response.data;
};

export const logoutSeeker = async (): Promise<void> => {
  await api.post("/seeker/auth/logout");
};
