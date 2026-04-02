export interface AuthUser {
  id: string;
  name: string;
  email: string;
  organization_id: string | null;
  id_verified: boolean;
  email_verified_at: string | null;
  roles?: string[];
  created_at?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  token_type: string;
  abilities: string[];
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StoredAuth {
  token: string;
  tokenType: string;
  abilities: string[];
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
