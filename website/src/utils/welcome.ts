import { useState, useEffect, useCallback } from "react";

export const MOBILE_WELCOME_STORAGE_KEY = "briksy_mobile_welcome_seen";
export const MOBILE_WELCOME_EVENT = "briksy-mobile-welcome-change";

/**
 * Checks whether the user has already seen and dismissed the mobile welcome screen.
 */
export const hasSeenMobileWelcome = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(MOBILE_WELCOME_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

/**
 * Sets or clears the mobile welcome screen flag in localStorage and dispatches a change event.
 */
export const setMobileWelcomeSeen = (seen: boolean): void => {
  if (typeof window === "undefined") return;
  try {
    if (seen) {
      localStorage.setItem(MOBILE_WELCOME_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(MOBILE_WELCOME_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent(MOBILE_WELCOME_EVENT, { detail: seen }));
  } catch (e) {
    console.error("Failed to update mobile welcome seen state:", e);
  }
};

/**
 * Hook to read and control the mobile welcome screen visibility.
 * The welcome screen is only shown when:
 * 1. Running in mobile app mode (Capacitor, standalone PWA, or dev override 'app')
 * 2. User has not previously seen/dismissed the welcome screen.
 */
export const useMobileWelcome = (isApp: boolean) => {
  const [hasSeen, setHasSeen] = useState<boolean>(() => hasSeenMobileWelcome());

  useEffect(() => {
    const handleUpdate = () => {
      setHasSeen(hasSeenMobileWelcome());
    };

    window.addEventListener(MOBILE_WELCOME_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(MOBILE_WELCOME_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const completeWelcome = useCallback(() => {
    setHasSeen(true);
    setMobileWelcomeSeen(true);
  }, []);

  const resetWelcome = useCallback(() => {
    setHasSeen(false);
    setMobileWelcomeSeen(false);
  }, []);

  return {
    showWelcome: isApp && !hasSeen,
    hasSeen,
    completeWelcome,
    resetWelcome,
  };
};
