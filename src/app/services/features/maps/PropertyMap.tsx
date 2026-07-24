import { useEffect, useMemo, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { loadGoogleMapsScript } from "./googleMapsLoader";
import type { PropertyMapFilters, PropertyMapItem } from "./property-map.types";

type Props = {
  properties: PropertyMapItem[];
  center?: { lat: number; lng: number };
  zoom?: number;
  filters?: PropertyMapFilters;
  onMarkerClick?: (property: PropertyMapItem) => void;
  height?: number;
};

const DEFAULT_CENTER = { lat: -25.2744, lng: 133.7751 };

const STATUS_COLORS: Record<string, string> = {
  approved: "#22c55e",
  published: "#22c55e",
  "pending review": "#f59e0b",
  pending: "#f59e0b",
  rejected: "#ef4444",
  inactive: "#9ca3af",
  archived: "#9ca3af",
  draft: "#9ca3af",
};

const normalizeStatus = (value: string) => value.trim().toLowerCase();

const isValidProperty = (property: PropertyMapItem) =>
  typeof property.latitude === "number" &&
  typeof property.longitude === "number" &&
  Number.isFinite(property.latitude) &&
  Number.isFinite(property.longitude);

const buildMarkerIcon = (status: string) => {
  const color = STATUS_COLORS[normalizeStatus(status)] ?? "#2563eb";

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
      <path d="M15 41C15 41 2 25.6 2 15C2 8.4 7.4 3 15 3C22.6 3 28 8.4 28 15C28 25.6 15 41 15 41Z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="15" cy="15" r="5.5" fill="#ffffff" fill-opacity="0.95"/>
    </svg>
  `)}`;
};

const waitForVisibleContainer = (element: HTMLDivElement, attempts = 12): Promise<void> =>
  new Promise((resolve, reject) => {
    const check = (remainingAttempts: number) => {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        resolve();
        return;
      }

      if (remainingAttempts <= 0) {
        reject(new Error("Map container has no visible dimensions."));
        return;
      }

      window.requestAnimationFrame(() => check(remainingAttempts - 1));
    };

    check(attempts);
  });

const PropertyMap = ({ properties, center, zoom = 6, filters, onMarkerClick, height = 640 }: Props) => {
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeZoom, setActiveZoom] = useState(zoom);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const googleMapsRef = useRef<any>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markerRefs = useRef<Map<string, any>>(new Map());
  const initialFitDoneRef = useRef(false);

  const validProperties = useMemo(() => properties.filter(isValidProperty), [properties]);
  const activeFilterCount = useMemo(
    () => Object.values(filters ?? {}).filter((value) => value !== undefined && value !== null && value !== "").length,
    [filters],
  );

  useEffect(() => {
    let active = true;
    setLoadState("loading");
    setError(null);

    loadGoogleMapsScript()
      .then(() => {
        if (!active) {
          return;
        }

        googleMapsRef.current = window.google;

        const element = mapContainerRef.current;
        if (!element || !window.google?.maps) {
          setError("Map container not found.");
          setLoadState("error");
          return;
        }

        const initialize = async () => {
          await waitForVisibleContainer(element);

          if (!active || !window.google?.maps) {
            return;
          }

          if (!mapRef.current) {
            mapRef.current = new window.google.maps.Map(element, {
              center: center ?? DEFAULT_CENTER,
              zoom,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true,
            });
          }

          if (!clustererRef.current) {
            clustererRef.current = new MarkerClusterer({ map: mapRef.current, markers: [] });
          }

          setLoadState("ready");
        };

        void initialize();
      })
      .catch((loadError: unknown) => {
        const message = loadError instanceof Error ? loadError.message : "Google Maps could not be loaded.";
        setError(message);
        setLoadState("error");
      });

    return () => {
      active = false;
      markerRefs.current.forEach((marker) => {
        if (googleMapsRef.current?.maps?.event) {
          googleMapsRef.current.maps.event.clearInstanceListeners(marker);
        }
        marker.setMap(null);
      });
      markerRefs.current.clear();
      clustererRef.current?.clearMarkers();
      if (mapRef.current && googleMapsRef.current?.maps?.event) {
        googleMapsRef.current.maps.event.clearInstanceListeners(mapRef.current);
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current || !googleMapsRef.current || loadState !== "ready") {
      return;
    }

    const googleMaps = googleMapsRef.current;
    const nextIds = new Set(validProperties.map((property) => property.id));

    markerRefs.current.forEach((marker, id) => {
      if (nextIds.has(id)) {
        return;
      }

      if (googleMaps.maps.event) {
        googleMaps.maps.event.clearInstanceListeners(marker);
      }

      marker.setMap(null);
      markerRefs.current.delete(id);
    });

    validProperties.forEach((property) => {
      const position = {
        lat: property.latitude as number,
        lng: property.longitude as number,
      };
      const existingMarker = markerRefs.current.get(property.id);
      const icon = buildMarkerIcon(property.status);

      if (existingMarker) {
        existingMarker.setPosition(position);
        existingMarker.setTitle(property.title);
        existingMarker.setIcon({
          url: icon,
          scaledSize: new googleMaps.maps.Size(30, 42),
          anchor: new googleMaps.maps.Point(15, 42),
        });
        return;
      }

      const marker = new googleMaps.maps.Marker({
        position,
        title: property.title,
        icon: {
          url: icon,
          scaledSize: new googleMaps.maps.Size(30, 42),
          anchor: new googleMaps.maps.Point(15, 42),
        },
      });

      marker.addListener("click", () => {
        onMarkerClick?.(property);
      });

      markerRefs.current.set(property.id, marker);
    });

    clustererRef.current?.clearMarkers();
    clustererRef.current?.addMarkers(Array.from(markerRefs.current.values()));

    const map = mapRef.current;

    if (validProperties.length === 0) {
      map.setCenter(center ?? DEFAULT_CENTER);
      map.setZoom(zoom);
      initialFitDoneRef.current = false;
      return;
    }

    const bounds = new googleMaps.maps.LatLngBounds();
    validProperties.forEach((property) => {
      bounds.extend({ lat: property.latitude as number, lng: property.longitude as number });
    });

    if (validProperties.length === 1) {
      map.setCenter({ lat: validProperties[0].latitude as number, lng: validProperties[0].longitude as number });
      map.setZoom(Math.max(zoom, 11));
      initialFitDoneRef.current = true;
      return;
    }

    if (!initialFitDoneRef.current) {
      map.fitBounds(bounds);
      initialFitDoneRef.current = true;
      return;
    }

    if (center) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [center, loadState, onMarkerClick, properties, validProperties, zoom]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const listener = mapRef.current.addListener("zoom_changed", () => {
      setActiveZoom(mapRef.current?.getZoom() ?? zoom);
    });

    return () => {
      listener.remove();
    };
  }, [zoom]);

  if (error) {
    return <div className="alert alert-danger mb-0">{error}</div>;
  }

  return (
    <div className="position-relative w-100 overflow-hidden border rounded-3 bg-light" style={{ minHeight: height }}>
      {loadState !== "ready" ? (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1 }}>
          <div className="w-100 h-100 p-4">
            <div className="placeholder-glow h-100 d-flex flex-column gap-3">
              <span className="placeholder col-12 rounded-3 flex-grow-1" />
              <span className="placeholder col-5 rounded-3" style={{ height: 16 }} />
            </div>
          </div>
        </div>
      ) : null}

      {activeFilterCount > 0 ? (
        <div className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-3 bg-white border shadow-sm fs-7 fw-semibold text-gray-700" style={{ zIndex: 2 }}>
          {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"} applied
        </div>
      ) : null}

      <div ref={mapContainerRef} className="w-100 h-100" style={{ minHeight: height }} />

      <div className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-3 bg-white border shadow-sm fs-8 text-gray-700" style={{ zIndex: 2 }}>
        Zoom {activeZoom}
      </div>
    </div>
  );
};

export default PropertyMap;
