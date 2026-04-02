import type { StoredAuth } from "./auth.types";

const AUTH_STORAGE_KEY = "briksy-website-auth";

export const getStoredAuth = (): StoredAuth | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredAuth;
  } catch (error) {
    console.error("Unable to parse stored auth state.", error);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const setStoredAuth = (auth: StoredAuth): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
