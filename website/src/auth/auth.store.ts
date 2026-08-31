import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getSeekerProfile,
  loginSeeker,
  logoutSeeker,
  registerSeeker,
} from "./auth.api";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "./auth.storage";
import type {
  AuthResponse,
  AuthRole,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  StoredAuth,
} from "./auth.types";

export interface SeekerAuthState {
  user: AuthUser | null;
  token: string | null;
  tokenType: string | null;
  abilities: string[];
  roles: AuthRole[];
  isAuthenticated: boolean;
  isBootstrapping: boolean;
}

const ADMIN_ROLES: AuthRole[] = [
  "super_admin",
  "admin",
  "super_admin_employee",
  "admin_staff",
];
const SEEKER_ROLES: AuthRole[] = ["seeker"];

const extractRoles = (user: AuthUser | null): AuthRole[] => {
  const roles = user?.roles ?? [];

  return roles.filter((role): role is AuthRole =>
    [...ADMIN_ROLES, ...SEEKER_ROLES].includes(role as AuthRole),
  );
};

const isSeekerOnlyAccount = (user: AuthUser | null): boolean => {
  const roles = extractRoles(user);

  if (roles.length === 0) {
    return false;
  }

  return (
    roles.some((role) => SEEKER_ROLES.includes(role)) &&
    !roles.some((role) => ADMIN_ROLES.includes(role))
  );
};

const createInitialState = (): SeekerAuthState => {
  const storedAuth = getStoredAuth();

  return {
    user: storedAuth?.user ?? null,
    token: storedAuth?.token ?? null,
    tokenType: storedAuth?.tokenType ?? null,
    abilities: storedAuth?.abilities ?? [],
    roles: extractRoles(storedAuth?.user ?? null),
    isAuthenticated: Boolean(storedAuth?.token),
    isBootstrapping: true,
  };
};

const buildStoredAuth = (response: AuthResponse): StoredAuth => ({
  token: response.token,
  tokenType: response.token_type,
  abilities: response.abilities,
  user: response.user,
});

const seekerAuthSlice = createSlice({
  name: "seekerAuth",
  initialState: createInitialState(),
  reducers: {
    setBootstrapping(state, action: PayloadAction<boolean>) {
      state.isBootstrapping = action.payload;
    },
    setSession(state, action: PayloadAction<StoredAuth>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenType = action.payload.tokenType;
      state.abilities = action.payload.abilities;
      state.roles = extractRoles(action.payload.user);
      state.isAuthenticated = true;
      state.isBootstrapping = false;
    },
    clearSession(state) {
      state.user = null;
      state.token = null;
      state.tokenType = null;
      state.abilities = [];
      state.roles = [];
      state.isAuthenticated = false;
      state.isBootstrapping = false;
    },
  },
});

export const { setBootstrapping, setSession, clearSession } =
  seekerAuthSlice.actions;

export const seekerAuthStore = configureStore({
  reducer: {
    seekerAuth: seekerAuthSlice.reducer,
  },
});

export type SeekerAuthRootState = ReturnType<typeof seekerAuthStore.getState>;
export type SeekerAuthDispatch = typeof seekerAuthStore.dispatch;

export const bootstrapSeekerAuth = async (
  dispatch: SeekerAuthDispatch,
): Promise<void> => {
  dispatch(setBootstrapping(true));

  const storedAuth = getStoredAuth();

  if (!storedAuth?.token) {
    dispatch(clearSession());
    return;
  }

  try {
    const response = await getSeekerProfile();
    if (!isSeekerOnlyAccount(response.data.user)) {
      clearStoredAuth();
      dispatch(clearSession());
      return;
    }

    const nextAuth: StoredAuth = {
      ...storedAuth,
      user: response.data.user,
    };

    setStoredAuth(nextAuth);
    dispatch(setSession(nextAuth));
  } catch (error) {
    console.error("Failed to restore seeker auth session.", error);
    clearStoredAuth();
    dispatch(clearSession());
  }
};

export const loginSeekerSession = async (
  dispatch: SeekerAuthDispatch,
  payload: LoginPayload,
): Promise<void> => {
  try {
    const response = await loginSeeker({
      email: payload.email.trim(),
      password: payload.password,
    });

    console.log("=== LOGIN API RESPONSE DATA ===", response.data);
    alert(`LOGIN SUCCESS!\n\nToken: ${response.data.token}\nToken Type: ${response.data.token_type || 'NONE'}`);

    const nextAuth = buildStoredAuth(response.data);

    if (!isSeekerOnlyAccount(nextAuth.user)) {
      clearStoredAuth();
      dispatch(clearSession());
      alert("LOGIN FAILED: Account not allowed to access seeker website.");
      throw new Error(
        "This account is not allowed to access the seeker website.",
      );
    }

    setStoredAuth(nextAuth);
    dispatch(setSession(nextAuth));
  } catch (error: any) {
    console.error("Login Error:", error);
    alert("LOGIN API REQUEST FAILED!\n\n" + (error?.response?.data?.message || error.message || "Unknown error"));
    throw error;
  }
};

export const registerSeekerSession = async (
  dispatch: SeekerAuthDispatch,
  payload: RegisterPayload,
): Promise<void> => {
  const normalizedPayload = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    password: payload.password,
    password_confirmation: payload.password_confirmation,
  };

  await registerSeeker(normalizedPayload);
  await loginSeekerSession(dispatch, {
    email: normalizedPayload.email,
    password: normalizedPayload.password,
  });
};

export const logoutSeekerSession = async (
  dispatch: SeekerAuthDispatch,
): Promise<void> => {
  try {
    await logoutSeeker();
  } catch (error) {
    console.error("Logout request failed.", error);
  } finally {
    clearStoredAuth();
    dispatch(clearSession());
  }
};
