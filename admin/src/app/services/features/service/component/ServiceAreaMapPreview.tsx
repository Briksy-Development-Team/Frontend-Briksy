import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsScript } from "../../maps/googleMapsLoader";
import type { ServiceAreaGeometry } from "../serviceAreaGeometry";
import { geometryToPath } from "../serviceAreaGeometry";

type Props = {
  serviceArea?: string | null;
  geometry?: ServiceAreaGeometry | null;
};

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

const ServiceAreaMapPreview = ({ serviceArea, geometry }: Props) => {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const normalizedServiceArea = useMemo(() => serviceArea?.trim() ?? "", [serviceArea]);
  const polygonPath = useMemo(() => geometryToPath(geometry), [geometry]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadState("loading");
    setError(null);
    setCoordinates(null);

    loadGoogleMapsScript()
      .then(() => {
        if (!active || !window.google?.maps) {
          return;
        }

        if (polygonPath.length >= 3) {
          setLoading(false);
          setLoadState("ready");
          return;
        }

        if (!normalizedServiceArea) {
          setLoading(false);
          setLoadState("ready");
          return;
        }

        geocoderRef.current = geocoderRef.current ?? new window.google.maps.Geocoder();

        geocoderRef.current.geocode({ address: normalizedServiceArea }, (results: any[], status: string) => {
          if (!active) {
            return;
          }

          if (status !== "OK" || !results?.[0]?.geometry?.location) {
            setError("We could not locate the service area on the map.");
            setLoading(false);
            setLoadState("error");
            return;
          }

          const location = results[0].geometry.location;
          setCoordinates({
            lat: location.lat(),
            lng: location.lng(),
          });
          setLoading(false);
          setLoadState("ready");
        });
      })
      .catch((loadError: unknown) => {
        console.error("Google Maps service area initialization failed.", loadError);
        setError(getFriendlyGoogleMapsError(loadError));
        setLoading(false);
        setLoadState("error");
      });

    return () => {
      active = false;
      if (window.google?.maps?.event) {
        if (markerRef.current) {
          window.google.maps.event.clearInstanceListeners(markerRef.current);
        }
        if (mapRef.current) {
          window.google.maps.event.clearInstanceListeners(mapRef.current);
        }
      }
    };
  }, [normalizedServiceArea, polygonPath.length]);

  useEffect(() => {
    if (loadState !== "ready" || !window.google?.maps) {
      return;
    }

    const element = document.getElementById("briksy-service-area-map");

    if (!element) {
      setError("Map container not found.");
      return;
    }

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(element, {
        center: coordinates ?? polygonPath[0] ?? { lat: -25.2744, lng: 133.7751 },
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    } else {
      mapRef.current.setCenter(coordinates ?? polygonPath[0] ?? { lat: -25.2744, lng: 133.7751 });
    }

    if (polygonPath.length >= 3) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      if (!polygonRef.current) {
        polygonRef.current = new window.google.maps.Polygon({
          paths: polygonPath,
          editable: false,
          draggable: false,
          fillColor: "#0d6efd",
          fillOpacity: 0.2,
          strokeColor: "#0d6efd",
          strokeWeight: 2,
        });
        polygonRef.current.setMap(mapRef.current);
      } else {
        polygonRef.current.setPaths(polygonPath);
        polygonRef.current.setMap(mapRef.current);
      }

      const bounds = new window.google.maps.LatLngBounds();
      polygonPath.forEach((point) => bounds.extend(point));
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds);
      }
    } else if (coordinates) {
      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({
          map: mapRef.current,
          position: coordinates,
        });
      } else {
        markerRef.current.setPosition(coordinates);
        markerRef.current.setMap(mapRef.current);
      }
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    } else {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    }
  }, [coordinates, loadState, polygonPath]);

  if (!normalizedServiceArea && polygonPath.length < 3) {
    return <div className="alert alert-light mb-0">No service area has been added yet.</div>;
  }

  if (error) {
    return <div className="alert alert-danger mb-0">{error}</div>;
  }

  return (
    <div className="position-relative rounded-4 overflow-hidden border bg-light" style={{ minHeight: 360 }}>
      {loading ? (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1 }}>
          <div className="w-100 h-100 p-4">
            <div className="placeholder-glow h-100 d-flex flex-column gap-3">
              <span className="placeholder col-12 rounded-3 flex-grow-1" />
              <span className="placeholder col-8 rounded-3" style={{ height: 16 }} />
            </div>
          </div>
        </div>
      ) : null}
      <div id="briksy-service-area-map" style={{ width: "100%", height: 360 }} />
      <div className="position-absolute bottom-0 start-0 m-4 bg-white border rounded-4 shadow-sm px-3 py-2">
        <div className="d-flex flex-column">
          <span className="fw-semibold">Service Area</span>
          <span className="text-muted fs-8">{normalizedServiceArea || "Custom boundary"}</span>
        </div>
      </div>
    </div>
  );
};

export { ServiceAreaMapPreview };
