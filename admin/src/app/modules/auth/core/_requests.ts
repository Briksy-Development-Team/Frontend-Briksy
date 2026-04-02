import axios from "axios";
import { AuthModel, UserModel } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL ?? "http://127.0.0.1:8000/api/admin";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  organization_id: string | null;
  id_verified: boolean;
  roles?: string[];
}

interface LoginResponse {
  user: ApiUser;
  token: string;
  token_type: string;
  abilities: string[];
}

const buildUserModel = (user: ApiUser): UserModel => {
  const nameParts = user.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  return {
    id: user.id,
    username: user.email,
    password: undefined,
    email: user.email,
    first_name: firstName,
    last_name: lastName,
    fullname: user.name,
    roles: user.roles?.map((_, index) => index + 1) ?? [],
    role_names: user.roles ?? [],
    organization_id: user.organization_id,
    id_verified: user.id_verified,
    pic: "/media/avatars/300-3.jpg",
  };
};

export async function login(email: string, password: string): Promise<AuthModel> {
  const response = await axios.post<ApiEnvelope<LoginResponse>>(`${API_URL}/auth/login`, {
    email,
    password,
  });

  return {
    api_token: response.data.data.token,
    token_type: response.data.data.token_type,
    abilities: response.data.data.abilities,
  };
}

export async function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
): Promise<AuthModel> {
  const fullName = [firstname, lastname].filter(Boolean).join(" ").trim();

  const response = await axios.post<ApiEnvelope<LoginResponse>>(`${API_URL}/auth/register`, {
    name: fullName,
    email,
    password,
    password_confirmation,
  });

  return {
    api_token: response.data.data.token,
    token_type: response.data.data.token_type,
    abilities: response.data.data.abilities,
  };
}

export async function requestPassword(): Promise<never> {
  throw new Error("Password reset is not configured for the admin app yet.");
}

export async function getUserByToken(): Promise<UserModel> {
  const response = await axios.get<ApiEnvelope<{ user: ApiUser }>>(`${API_URL}/auth/me`);

  return buildUserModel(response.data.data.user);
}

export async function logoutCurrentUser(): Promise<void> {
  await axios.post(`${API_URL}/auth/logout`);
}
