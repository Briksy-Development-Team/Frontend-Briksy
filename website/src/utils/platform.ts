import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

export const DEV_PLATFORM_STORAGE_KEY = "briksy_dev_platform_override";

/**
 * Checks if the app is running in a Capacitor native container (Android / iOS).
 */
export const isNativeApp = (): boolean => {
  return typeof window !== "undefined" && Capacitor.isNativePlatform();
};

/**
 * Checks if the app is running as an installed standalone Progressive Web App.
 */
export const isStandalonePWA = (): boolean => {
  if (typeof window === "undefined") return false;
  const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
  const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return isStandaloneMedia || isIosStandalone;
};

/**
 * Retrieves development override from localStorage ('app' | 'web' | null).
 */
export const getDevPlatformOverride = (): "app" | "web" | null => {
  if (typeof window === "undefined" || !import.meta.env.DEV) return null;
  const val = localStorage.getItem(DEV_PLATFORM_STORAGE_KEY);
  if (val === "app" || val === "web") return val;
  return null;
};

/**
 * Sets or clears the development platform override.
 */
export const setDevPlatformOverride = (override: "app" | "web" | null): void => {
  if (typeof window === "undefined") return;
  if (override) {
    localStorage.setItem(DEV_PLATFORM_STORAGE_KEY, override);
  } else {
    localStorage.removeItem(DEV_PLATFORM_STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent("briksy-platform-override-change", { detail: override }));
};

/**
 * Synchronous evaluator: returns true if running as mobile app / PWA, or if dev override is 'app'.
 */
export const isRunningAsMobileApp = (): boolean => {
  const override = getDevPlatformOverride();
  if (override !== null) {
    return override === "app";
  }
  return isNativeApp() || isStandalonePWA();
};

/**
 * React hook that returns true when in Mobile App / PWA mode and dynamically updates
 * when the dev switcher changes or the display-mode changes.
 */
export const useIsMobileApp = (): boolean => {
  const [isApp, setIsApp] = useState<boolean>(() => isRunningAsMobileApp());

  useEffect(() => {
    const update = () => {
      setIsApp(isRunningAsMobileApp());
    };

    window.addEventListener("briksy-platform-override-change", update);
    window.addEventListener("storage", update);

    let mql: MediaQueryList | null = null;
    if (typeof window !== "undefined" && window.matchMedia) {
      mql = window.matchMedia("(display-mode: standalone)");
      mql.addEventListener("change", update);
    }

    return () => {
      window.removeEventListener("briksy-platform-override-change", update);
      window.removeEventListener("storage", update);
      if (mql) {
        mql.removeEventListener("change", update);
      }
    };
  }, []);

  return isApp;
};
