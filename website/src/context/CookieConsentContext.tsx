import React, { createContext, useContext, useEffect, useState } from "react";

export type ConsentStatus = "accepted" | "declined" | null;

interface CookieConsentContextType {
  consent: ConsentStatus;
  acceptConsent: () => void;
  declineConsent: () => void;
  resetConsent: () => void;
}

const STORAGE_KEY = "briksy_cookie_consent";

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<ConsentStatus>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "accepted" || saved === "declined") {
        return saved;
      }
    } catch {
      // localStorage might be unavailable or disabled
    }
    return null;
  });

  const acceptConsent = () => {
    setConsent("accepted");
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore storage error
    }
  };

  const declineConsent = () => {
    setConsent("declined");
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch {
      // ignore storage error
    }
  };

  const resetConsent = () => {
    setConsent(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage error
    }
  };

  // Dispatch custom event for optional analytics initialization when consent status changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (consent === "accepted") {
      window.dispatchEvent(new CustomEvent("briksy_consent_accepted"));
    } else if (consent === "declined") {
      window.dispatchEvent(new CustomEvent("briksy_consent_declined"));
    }
  }, [consent]);

  return (
    <CookieConsentContext.Provider value={{ consent, acceptConsent, declineConsent, resetConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
};
