import axios from "axios";
import { AuthModel, UserModel } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/user`;
export const LOGIN_URL = `${API_URL}/super-admin/auth/login`;
export const ADMIN_LOGIN_URL = `${API_URL}/admin/auth/login`;
export const SEEKER_LOGIN_URL = `${API_URL}/seeker/auth/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Server should return AuthModel
export function login(email: string, password: string, userType: 'super-admin' | 'admin' | 'seeker' = 'super-admin') {
  const url = userType === 'super-admin' ? LOGIN_URL : userType === 'admin' ? ADMIN_LOGIN_URL : SEEKER_LOGIN_URL;

  return axios.post<{
    success: boolean;
    data: {
      user: UserModel;
      token: string;
      token_type: string;
      abilities: string[];
    };
    message: string;
  }>(url, {
    email,
    password,
  });
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  return axios.get<{
    id: number;
    name: string;
    email: string;
    organization_id: string | null;
    id_verified: boolean;
    email_verified_at: string | null;
    roles: string[];
    created_at: string;
  }>(GET_USER_BY_ACCESSTOKEN_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
