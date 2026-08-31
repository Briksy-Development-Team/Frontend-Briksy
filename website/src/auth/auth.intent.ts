import type { PendingFavoriteAction } from "./auth.types";

const PENDING_AUTH_ACTION_KEY = "briksy-website-pending-auth-action";

export const storePendingFavoriteAction = (
  propertyId: string,
  fromPath?: string,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: PendingFavoriteAction = {
    type: "favorite",
    propertyId,
    fromPath,
  };

  window.localStorage.setItem(PENDING_AUTH_ACTION_KEY, JSON.stringify(payload));
};

export const readPendingFavoriteAction = (): PendingFavoriteAction | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(PENDING_AUTH_ACTION_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PendingFavoriteAction;
  } catch (error) {
    console.error("Unable to parse pending auth action.", error);
    window.localStorage.removeItem(PENDING_AUTH_ACTION_KEY);
    return null;
  }
};

export const clearPendingFavoriteAction = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PENDING_AUTH_ACTION_KEY);
};
