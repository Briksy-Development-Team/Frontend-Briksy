import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Lock, ChevronRight } from "lucide-react";
import { useCookieConsent, type ConsentPrefs } from "../../context/CookieConsentContext";
import { useReady } from "../utils/ReadyContext";

const TYPES = [
  { key: "essential",       label: "Essential",        desc: "Login, auth, search state. Required for the site to work.", locked: true },
  { key: "analytics",       label: "Analytics",        desc: "Page views and search behaviour.", locked: false },
  { key: "personalisation", label: "Personalisation",  desc: "Saved searches, preferred types and locations.", locked: false },
  { key: "marketing",       label: "Marketing",        desc: "Retargeting ads and recommendation emails.", locked: false },
] as const;

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
    className={`relative shrink-0 w-10 h-5 rounded-full transition-colors cursor-pointer ${on ? "bg-[#342511]" : "bg-[#C4B8A8]"}`}>
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}`} />
  </button>
);

export default function CookieConsent() {
  const { consent, prefs, acceptConsent, declineConsent, saveConsent } = useCookieConsent();
  const { ready } = useReady();
  const [managing, setManaging] = useState(false);
  const [local, setLocal] = useState<ConsentPrefs>(prefs);

  if (consent !== null || !ready) return null;

  const card = "rounded-[20px] bg-[#E2CBB3] p-4 text-[#342511] shadow-[0_10px_10px_rgba(0,0,0,0.10)]";
  const btnPrimary = "rounded-full bg-[#342511] px-5 py-1.5 text-[0.75rem] text-[#F8F4EE] hover:opacity-90 cursor-pointer";
  const btnGhost = "text-[0.75rem] text-[#8B6F54] hover:text-[#342511] transition-colors cursor-pointer";

  return (
    // ponytail: fixed corner — no inset-0, page stays interactive behind banner
    <div className="fixed bottom-4 left-4 z-[100] w-[calc(100vw-2rem)] max-w-[400px]">
      {!managing ? (
        <div className={card}>
          <h2 className="font-medium">We use cookies</h2>
          <p className="mt-1 text-[0.8125rem] text-[#6B5240]">
            To improve your experience and analyse traffic. See our{" "}
            <Link to="/privacy-policy" className="underline hover:text-[#342511]">Privacy Policy</Link>.
          </p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button type="button" onClick={() => { setLocal(prefs); setManaging(true); }}
              className={`${btnGhost} flex items-center gap-1`}>
              Manage cookies <ChevronRight size={13} />
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={declineConsent}
                className="rounded-full border border-[#342511]/30 px-4 py-1.5 text-[0.75rem] text-[#342511] hover:bg-[#342511]/10 cursor-pointer">
                Decline
              </button>
              <button type="button" onClick={acceptConsent} className={btnPrimary}>Accept all</button>
            </div>
          </div>
        </div>
      ) : (
        <div className={card}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Manage cookies</h2>
            <button type="button" onClick={() => setManaging(false)} className="p-1 rounded-full hover:bg-black/10 cursor-pointer"><X size={15} /></button>
          </div>

          <div className="space-y-3">
            {TYPES.map(({ key, label, desc, locked }) => (
              <div key={key} className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8125rem] font-medium">{label}</p>
                  <p className="text-[0.71875rem] text-[#6B5240] mt-0.5">{desc}</p>
                </div>
                {locked
                  ? <span className="shrink-0 flex items-center gap-1 text-[#8B6F54] text-[0.6875rem] mt-0.5"><Lock size={11} />Always on</span>
                  : <Toggle on={local[key] as boolean} onChange={v => setLocal(p => ({ ...p, [key]: v }))} />}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#342511]/15">
            <button type="button" onClick={acceptConsent} className={btnGhost}>Accept all</button>
            <button type="button" onClick={() => saveConsent(local)} className={btnPrimary}>Save preferences</button>
          </div>
        </div>
      )}
    </div>
  );
}
