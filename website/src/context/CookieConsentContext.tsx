import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ConsentPrefs = { essential: true; analytics: boolean; personalisation: boolean; marketing: boolean };
export type ConsentStatus = "accepted" | "declined" | "custom" | null;

interface Ctx {
  consent: ConsentStatus; prefs: ConsentPrefs;
  acceptConsent: () => void; declineConsent: () => void;
  saveConsent: (p: ConsentPrefs) => void; resetConsent: () => void;
}

const KEY = "briksy_cookie_consent";
const OFF: ConsentPrefs = { essential: true, analytics: false, personalisation: false, marketing: false };
const ALL: ConsentPrefs = { essential: true, analytics: true, personalisation: true, marketing: true };

function load(): { status: ConsentStatus; prefs: ConsentPrefs } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { status: null, prefs: OFF };
    if (raw === "accepted") return { status: "accepted", prefs: ALL };
    if (raw === "declined") return { status: "declined", prefs: OFF };
    const p = JSON.parse(raw);
    return { status: p.status ?? null, prefs: { ...OFF, ...p.prefs, essential: true } };
  } catch { return { status: null, prefs: OFF }; }
}

function save(status: ConsentStatus, prefs: ConsentPrefs) {
  try { localStorage.setItem(KEY, JSON.stringify({ status, prefs })); } catch {}
}

const CookieConsentContext = createContext<Ctx | undefined>(undefined);

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const init = load();
  const [consent, setConsent] = useState<ConsentStatus>(init.status);
  const [prefs, setPrefs] = useState<ConsentPrefs>(init.prefs);

  const set = (status: ConsentStatus, p: ConsentPrefs) => { setConsent(status); setPrefs(p); save(status, p); };

  const acceptConsent = () => set("accepted", ALL);
  const declineConsent = () => set("declined", OFF);
  const saveConsent = (p: ConsentPrefs) => set(p.analytics && p.personalisation && p.marketing ? "accepted" : "custom", { ...p, essential: true });
  const resetConsent = () => { setConsent(null); setPrefs(OFF); try { localStorage.removeItem(KEY); } catch {} };

  useEffect(() => {
    if (consent) window.dispatchEvent(new CustomEvent(`briksy_consent_${consent}`, { detail: prefs }));
  }, [consent]);

  return <CookieConsentContext.Provider value={{ consent, prefs, acceptConsent, declineConsent, saveConsent, resetConsent }}>{children}</CookieConsentContext.Provider>;
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
};
