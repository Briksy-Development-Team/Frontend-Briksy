import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { getStoredLocation, requestUserLocation } from "../../utils/location";

const DISMISSED_KEY = "briksy_location_prompt_dismissed";

const LocationPermissionPrompt = () => {
  const [visible, setVisible] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!getStoredLocation() && window.localStorage.getItem(DISMISSED_KEY) !== "1") setVisible(true);
  }, []);

  if (!visible) return null;

  const enableLocation = async () => {
    setRequesting(true);
    try { await requestUserLocation(); setVisible(false); } catch { setRequesting(false); }
  };
  const dismiss = () => { window.localStorage.setItem(DISMISSED_KEY, "1"); setVisible(false); };

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5">
      <MapPin className="h-5 w-5 shrink-0 text-[#e86749]" />
      <p className="flex-1 text-sm text-[#342511]">Allow location access to see nearby properties, builders, agents and professionals first.</p>
      <button type="button" onClick={enableLocation} disabled={requesting} className="shrink-0 rounded-xl bg-[#e86749] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">{requesting ? "Locating..." : "Use my location"}</button>
      <button type="button" onClick={dismiss} aria-label="Dismiss location prompt" className="shrink-0 text-[#342511]/60 hover:text-[#342511]"><X className="h-4 w-4" /></button>
    </div>
  );
};

export default LocationPermissionPrompt;
