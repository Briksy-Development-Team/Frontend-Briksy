import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsScript } from "./googleMapsLoader";
import type { LocationSelection } from "./LocationAutocomplete";

type Props = {
  latitude?: number | string | null;
  longitude?: number | string | null;
  address?: string;
  onChange: (selection: LocationSelection) => void;
  height?: number;
};

const DEFAULT_CENTER = { lat: -25.2744, lng: 133.7751 };

const normalizeNumber = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const extractComponent = (components: any[] | undefined, type: string) =>
  components?.find((component) => component.types.includes(type))?.long_name ?? "";

const getFriendlyGoogleMapsError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Google Maps could not be loaded.";
  if (/apikey|key/i.test(message)) {
    return "Google Maps API key is missing or invalid.";
  }
  if (/quota|billing|over/i.test(message)) {
    return "Google Maps quota or billing limits were reached. Please try again later.";
  }
  return message;
};

const LocationMapPreview = ({ latitude, longitude, address, onChange, height = 280 }: Props) => {
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const listenersAttachedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const refreshTimerRef = useRef<number | null>(null);
  const lat = normalizeNumber(latitude);
  const lng = normalizeNumber(longitude);

  const coordinates = useMemo(() => (lat !== null && lng !== null ? { lat, lng } : null), [lat, lng]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let active = true;

    if (!coordinates) {
      setLoadState("idle");
      return;
    }

    setLoadState("loading");
    setError(null);

    loadGoogleMapsScript()
      .then(() => {
        if (!active) {
          return;
        }

        const element = mapContainerRef.current;
        if (!element || !window.google?.maps) {
          setError("Map container not found.");
          setLoadState("error");
          return;
        }

        if (!mapRef.current) {
          mapRef.current = new window.google.maps.Map(element, {
            center: coordinates,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
        } else {
          mapRef.current.setCenter(coordinates);
        }

        if (refreshTimerRef.current) {
          window.clearTimeout(refreshTimerRef.current);
        }

        refreshTimerRef.current = window.setTimeout(() => {
          if (!active || !mapRef.current || !window.google?.maps) {
            return;
          }

          window.google.maps.event.trigger(mapRef.current, "resize");
          mapRef.current.setCenter(coordinates);
        }, 50);

        if (!markerRef.current) {
          markerRef.current = new window.google.maps.Marker({
            map: mapRef.current,
            position: coordinates,
            draggable: true,
          });
        } else {
          markerRef.current.setMap(mapRef.current);
          markerRef.current.setPosition(coordinates);
        }

        geocoderRef.current = geocoderRef.current ?? new window.google.maps.Geocoder();

        const updateLocationFromPoint = (position: { lat: number; lng: number }) => {
          geocoderRef.current.geocode({ location: position }, (results: any[], status: string) => {
            if (!active) {
              return;
            }

            if (status !== "OK" || !results?.[0]) {
              setError("Reverse geocoding failed. You can still save the coordinates manually.");
              return;
            }

            const place = results[0];
            const components = place.address_components ?? [];
            const streetNumber = extractComponent(components, "street_number");
            const route = extractComponent(components, "route");
            const locality = extractComponent(components, "locality") || extractComponent(components, "sublocality");
            const state = extractComponent(components, "administrative_area_level_1");
            const postcode = extractComponent(components, "postal_code");
            const country = extractComponent(components, "country") || "Australia";
            const formattedAddress = place.formatted_address ?? address ?? "";
            const addressLine1 = [streetNumber, route].filter(Boolean).join(" ").trim() || formattedAddress;

            onChangeRef.current({
              address_line_1: addressLine1,
              address: addressLine1,
              full_address: formattedAddress,
              formatted_address: formattedAddress,
              place_id: place.place_id,
              latitude: position.lat,
              longitude: position.lng,
              suburb: locality,
              state,
              postcode,
              country,
              location_verified: true,
            });
            setError(null);
          });
        };

        if (!listenersAttachedRef.current) {
          markerRef.current.addListener("dragend", () => {
            const position = markerRef.current?.getPosition();
            if (!position) {
              return;
            }

            updateLocationFromPoint({
              lat: position.lat(),
              lng: position.lng(),
            });
          });

          mapRef.current.addListener("click", (event: any) => {
            if (!event?.latLng) {
              return;
            }

            const position = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            markerRef.current?.setPosition(position);
            updateLocationFromPoint(position);
          });

          listenersAttachedRef.current = true;
        }

        setLoadState("ready");
      })
      .catch((err: unknown) => {
        console.error("Google Maps map preview initialization failed.", err);
        setError(getFriendlyGoogleMapsError(err));
        setLoadState("error");
      });

    return () => {
      active = false;
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      if (window.google?.maps?.event) {
        if (markerRef.current) {
          window.google.maps.event.clearInstanceListeners(markerRef.current);
        }
        if (mapRef.current) {
          window.google.maps.event.clearInstanceListeners(mapRef.current);
        }
      }
    };
  }, [address, coordinates]);

  if (!coordinates) {
    return (
      <div className="alert alert-light border-dashed">
        Add latitude and longitude to preview the location on Google Maps.
      </div>
    );
  }

  return (
    <div className="position-relative rounded-4 overflow-hidden border bg-light">
      {error ? (
        <div className="position-absolute top-0 start-0 w-100 p-3" style={{ zIndex: 2 }}>
          <div className="alert alert-warning mb-0">{error}</div>
        </div>
      ) : null}
      {loadState !== "ready" ? (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: height, zIndex: 1 }}>
          <div className="w-100 h-100 p-4">
            <div className="placeholder-glow h-100 d-flex flex-column gap-3">
              <span className="placeholder col-12 rounded-3 flex-grow-1" />
              <span className="placeholder col-8 rounded-3" style={{ height: 16 }} />
              <span className="placeholder col-6 rounded-3" style={{ height: 16 }} />
            </div>
          </div>
        </div>
      ) : null}
      <div ref={mapContainerRef} style={{ width: "100%", height, minHeight: height }} />
    </div>
  );
};

export { LocationMapPreview };
