import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AxiosError } from "axios";
import { getSeekerProfile, loginSeeker, logoutSeeker, registerSeeker } from "./auth.api";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "./auth.storage";
import type {
  LoginPayload,
  RegisterPayload,
  StoredAuth,
  AuthUser,
} from "./auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  abilities: string[];
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      "Something went wrong while contacting the server.";

    return message;
  }

  return "Something went wrong while contacting the server.";
};

const toStoredAuth = (auth: {
  token: string;
  tokenType: string;
  abilities: string[];
  user: AuthUser;
}): StoredAuth => ({
  token: auth.token,
  tokenType: auth.tokenType,
  abilities: auth.abilities,
  user: auth.user,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<StoredAuth | null>(() => getStoredAuth());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let ignore = false;

    const bootstrapAuth = async () => {
      const storedAuth = getStoredAuth();

      if (!storedAuth) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const response = await getSeekerProfile();

        if (!ignore) {
          const nextAuth = {
            ...storedAuth,
            user: response.data.user,
          };

          setAuth(nextAuth);
          setStoredAuth(nextAuth);
        }
      } catch (error) {
        console.error("Failed to restore auth session.", error);

        if (!ignore) {
          clearStoredAuth();
          setAuth(null);
        }
      } finally {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await loginSeeker({
      email: payload.email.trim(),
      password: payload.password,
    });

    const nextAuth = toStoredAuth({
      token: response.data.token,
      tokenType: response.data.token_type,
      abilities: response.data.abilities,
      user: response.data.user,
    });

    setAuth(nextAuth);
    setStoredAuth(nextAuth);
  };

  const register = async (payload: RegisterPayload) => {
    const normalizedPayload = {
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    };

    await registerSeeker(normalizedPayload);
    await login({
      email: normalizedPayload.email,
      password: normalizedPayload.password,
    });
  };

  const logout = async () => {
    try {
      await logoutSeeker();
    } catch (error) {
      console.error("Logout request failed.", getErrorMessage(error));
    } finally {
      clearStoredAuth();
      setAuth(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      abilities: auth?.abilities ?? [],
      isAuthenticated: Boolean(auth?.token),
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [auth, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};

export const getAuthErrorMessage = getErrorMessage;
