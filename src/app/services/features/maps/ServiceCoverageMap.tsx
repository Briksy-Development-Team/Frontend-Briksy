import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsScript } from "./googleMapsLoader";
import { geometryToPath } from "../service/serviceAreaGeometry";
import type { ServiceMapItem } from "./service-map.types";

type Props = {
  services: ServiceMapItem[];
  onRegionClick?: (service: ServiceMapItem) => void;
  height?: number;
};

const DEFAULT_CENTER = { lat: -25.2744, lng: 133.7751 };

const STATUS_COLORS: Record<string, string> = {
  active: "#22c55e",
  inactive: "#9ca3af",
};

const normalizeStatus = (value?: string | null) => (value ?? "").trim().toLowerCase();

const ServiceCoverageMap = ({ services, onRegionClick, height = 640 }: Props) => {
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const googleMapsRef = useRef<any>(null);
  const shapeRefs = useRef<Map<string, any>>(new Map());
  const geocoderRef = useRef<any>(null);

  const validServices = useMemo(() => services.filter((service) => !!service.name), [services]);

  useEffect(() => {
    let active = true;
    setLoadState("loading");
    setError(null);

    loadGoogleMapsScript()
      .then(() => {
        if (!active || !window.google?.maps) {
          return;
        }

        googleMapsRef.current = window.google;

        const element = mapContainerRef.current;
        if (!element) {
          setError("Map container not found.");
          setLoadState("error");
          return;
        }

        if (!mapRef.current) {
          mapRef.current = new window.google.maps.Map(element, {
            center: DEFAULT_CENTER,
            zoom: 5,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
          });
        }

        setLoadState("ready");
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Google Maps could not be loaded.");
        setLoadState("error");
      });

    return () => {
      active = false;
      shapeRefs.current.forEach((shape) => {
        shape.setMap(null);
        googleMapsRef.current?.maps?.event?.clearInstanceListeners(shape);
      });
      shapeRefs.current.clear();
    };
  }, []);

  useEffect(() => {
    if (loadState !== "ready" || !window.google?.maps || !mapRef.current) {
      return;
    }

    const googleMaps = window.google;
    const map = mapRef.current;
    const nextIds = new Set(validServices.map((service) => service.id));
    const bounds = new googleMaps.maps.LatLngBounds();
    let cancelled = false;

    shapeRefs.current.forEach((shape, id) => {
      if (nextIds.has(id)) {
        return;
      }

      shape.setMap(null);
      googleMaps.maps.event.clearInstanceListeners(shape);
      shapeRefs.current.delete(id);
    });

    const resolveCircle = async (service: ServiceMapItem) =>
      new Promise<void>((resolve) => {
        const locationText = service.service_area?.trim();
        if (!locationText) {
          resolve();
          return;
        }

        geocoderRef.current = geocoderRef.current ?? new googleMaps.maps.Geocoder();
        geocoderRef.current.geocode({ address: locationText }, (results: any[], status: string) => {
          if (cancelled) {
            resolve();
            return;
          }

          if (status !== "OK" || !results?.[0]?.geometry?.location) {
            resolve();
            return;
          }

          const location = results[0].geometry.location;
          const center = { lat: location.lat(), lng: location.lng() };
          const radius = 12000;

          const existingCircle = shapeRefs.current.get(service.id);
          if (existingCircle?.setCenter) {
            existingCircle.setCenter(center);
            existingCircle.setRadius(radius);
            existingCircle.setMap(map);
          } else {
            const circle = new googleMaps.maps.Circle({
              map,
              center,
              radius,
              fillColor: STATUS_COLORS[normalizeStatus(service.status ?? (service.is_active ? "active" : "inactive"))] ?? "#2563eb",
              fillOpacity: 0.18,
              strokeColor: STATUS_COLORS[normalizeStatus(service.status ?? (service.is_active ? "active" : "inactive"))] ?? "#2563eb",
              strokeWeight: 2,
            });

            circle.addListener("click", () => onRegionClick?.(service));
            shapeRefs.current.set(service.id, circle);
          }

          bounds.extend(center);
          const boundsCircle = new googleMaps.maps.Circle({ center, radius });
          const circleBounds = boundsCircle.getBounds();
          if (circleBounds) {
            bounds.union(circleBounds);
          }

          resolve();
        });
      });

    void (async () => {
      for (const service of validServices) {
        const color = STATUS_COLORS[normalizeStatus(service.status ?? (service.is_active ? "active" : "inactive"))] ?? "#2563eb";
        const polygonPath = geometryToPath(service.service_area_geometry);
        const existing = shapeRefs.current.get(service.id);

        if (polygonPath.length >= 3) {
          if (existing?.setPaths) {
            existing.setPaths(polygonPath);
            existing.setMap(map);
          } else {
            const polygon = new googleMaps.maps.Polygon({
              paths: polygonPath,
              editable: false,
              draggable: false,
              fillColor: color,
              fillOpacity: 0.22,
              strokeColor: color,
              strokeWeight: 2,
            });

            polygon.addListener("click", () => onRegionClick?.(service));
            polygon.setMap(map);
            shapeRefs.current.set(service.id, polygon);
          }

          polygonPath.forEach((point) => bounds.extend(point));
          continue;
        }

        await resolveCircle(service);
      }

      if (cancelled) {
        return;
      }

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      } else {
        map.setCenter(DEFAULT_CENTER);
        map.setZoom(5);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadState, onRegionClick, validServices]);

  if (error) {
    return <div className="alert alert-danger mb-0">{error}</div>;
  }

  return (
    <div className="position-relative rounded-4 overflow-hidden border bg-light" style={{ minHeight: height }}>
      <div ref={mapContainerRef} style={{ width: "100%", height }} />
      {loadState === "loading" ? (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1 }}>
          <div className="bg-white border rounded-4 shadow-sm px-4 py-3">Loading service coverage map...</div>
        </div>
      ) : null}
    </div>
  );
};

export { ServiceCoverageMap };
