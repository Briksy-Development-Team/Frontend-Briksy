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
  business_name: string;
  trading_name?: string;
  business_type: "organisation" | "company" | "solo_trader";
  abn_number: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  state?: string;
  postcode?: string;
  password: string;
  password_confirmation: string;
  referral_code?: string;
};

type AbnVerificationPayload = {
  abn: string;
  business_type?: "organisation" | "company" | "solo_trader";
};

export type AbnVerificationResponse = {
  valid: boolean;
  abn: string;
  entityName: string;
  entityType: string;
  gstRegistered: boolean;
  state?: string | null;
  postcode?: string | null;
  acn?: string | null;
  status: string;
  message?: string | null;
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

export async function verifyAbn(payload: AbnVerificationPayload) {
  const response = await api.post<AbnVerificationResponse>(
    "/auth/verify-abn",
    payload,
  );

  return response.data;
}

export async function getUserByToken() {
  const auth = getAuth();
  const basePath = auth?.abilities?.includes("super_admin") || auth?.abilities?.includes("super_admin_employee")
    ? "/super-admin"
    : "/admin";
  const response =
    await api.get<AdminAuthEnvelope<{ user: UserModel }>>(`${basePath}/auth/me`);

  return response.data;
}

export async function getPermissionsByToken() {
  const response = await api.get<AdminAuthEnvelope<{
    effective_permission_names: string[];
    enabled_modules?: string[];
    user?: {
      business_type?: string | null;
      business_verification_status?: string | null;
      subscription?: {
        organization_id?: string | null;
        plan_id?: string | null;
        status?: "trialing" | "active" | "expired" | "inactive";
        is_trial_active?: boolean;
        trial_started_at?: string | null;
        trial_ends_at?: string | null;
        subscription_activated_at?: string | null;
      };
    };
    grouped: Array<{ module: string; permissions: Array<Record<string, unknown>> }>;
  }>>("/me/permissions");

  return response.data;
}

export async function logout() {
  const auth = getAuth();
  const basePath = auth?.abilities?.includes("super_admin") || auth?.abilities?.includes("super_admin_employee")
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
