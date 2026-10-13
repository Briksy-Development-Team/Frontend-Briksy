export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  updatedAt: number;
};

const STORAGE_KEY = "briksy_user_location";

export const getStoredLocation = (): UserLocation | null => {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (parsed && Number.isFinite(parsed.latitude) && Number.isFinite(parsed.longitude)) return parsed as UserLocation;
  } catch { /* Ignore malformed browser storage. */ }
  return null;
};

export const requestUserLocation = (): Promise<UserLocation> => new Promise((resolve, reject) => {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    reject(new Error("Location is not supported by this browser."));
    return;
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const location: UserLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    window.dispatchEvent(new CustomEvent("briksy:location-updated", { detail: location }));
    resolve(location);
  }, reject, { enableHighAccuracy: false, timeout: 10000, maximumAge: 15 * 60 * 1000 });
});
