import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsScript } from "../../maps/googleMapsLoader";
import type { ServiceAreaGeometry } from "../serviceAreaGeometry";
import { geometryToPath, pathToGeometry } from "../serviceAreaGeometry";

type Props = {
  value?: ServiceAreaGeometry | null;
  onChange: (geometry: ServiceAreaGeometry | null) => void;
  addressHint?: string | null;
};

const DEFAULT_CENTER = { lat: -25.2744, lng: 133.7751 };

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

const ServiceAreaGeometryEditor = ({ value, onChange, addressHint }: Props) => {
  const mapRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const previewLineRef = useRef<any>(null);
  const mapClickListenerRef = useRef<any>(null);
  const drawingEnabledRef = useRef(false);
  const geocoderRef = useRef<any>(null);
  const listenersRef = useRef<any[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const initialPath = useMemo(() => geometryToPath(value), [value]);

  const clearPathListeners = () => {
    listenersRef.current.forEach((listener) => {
      listener?.remove?.();
    });
    listenersRef.current = [];
  };

  const syncGeometryFromPolygon = (polygon: any) => {
    const path = polygon?.getPath?.()?.getArray?.()?.map((point: any) => ({
      lat: point.lat(),
      lng: point.lng(),
    })) ?? [];

    onChange(pathToGeometry(path));
  };

  const clearPolygon = () => {
    clearPathListeners();

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
  };

  const clearPreviewLine = () => {
    if (previewLineRef.current) {
      previewLineRef.current.setMap(null);
      previewLineRef.current = null;
    }
  };

  const setPolygonPath = (path: { lat: number; lng: number }[], map: any) => {
    if (path.length < 3) {
      return;
    }

    if (!polygonRef.current) {
      polygonRef.current = new window.google.maps.Polygon({
        paths: path,
        editable: true,
        draggable: true,
        fillColor: "#0d6efd",
        fillOpacity: 0.2,
        strokeColor: "#0d6efd",
        strokeWeight: 2,
      });
      polygonRef.current.setMap(map);

      const polygonPath = polygonRef.current.getPath();
      listenersRef.current.push(
        polygonPath.addListener("insert_at", () => syncGeometryFromPolygon(polygonRef.current)),
        polygonPath.addListener("set_at", () => syncGeometryFromPolygon(polygonRef.current)),
        polygonRef.current.addListener("dragend", () => syncGeometryFromPolygon(polygonRef.current)),
      );
    } else {
      polygonRef.current.setPaths(path);
      polygonRef.current.setMap(map);
    }

    clearPreviewLine();
    onChange(pathToGeometry(path));
  };

  useEffect(() => {
    let active = true;

    setLoadState("loading");
    setError(null);

    loadGoogleMapsScript()
      .then(() => {
        if (!active || !window.google?.maps) {
          return;
        }

        const element = document.getElementById("briksy-service-area-editor");

        if (!element) {
          setError("Map container not found.");
          setLoadState("error");
          return;
        }

        if (!mapRef.current) {
          mapRef.current = new window.google.maps.Map(element, {
            center: DEFAULT_CENTER,
            zoom: 5,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
        }

        const map = mapRef.current;
        geocoderRef.current = geocoderRef.current ?? new window.google.maps.Geocoder();
        drawingEnabledRef.current = initialPath.length < 3;

        mapClickListenerRef.current?.remove?.();
        mapClickListenerRef.current = map.addListener("click", (event: any) => {
          if (!drawingEnabledRef.current || !event?.latLng) {
            return;
          }

          const point = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };

          const nextPath = [
            ...(previewLineRef.current?.getPath?.()?.getArray?.()?.map((marker: any) => ({
              lat: marker.lat(),
              lng: marker.lng(),
            })) ?? []),
            point,
          ];

          if (previewLineRef.current) {
            previewLineRef.current.setPath(nextPath);
          } else {
            previewLineRef.current = new window.google.maps.Polyline({
              path: nextPath,
              clickable: false,
              geodesic: true,
              strokeColor: "#0d6efd",
              strokeOpacity: 0.9,
              strokeWeight: 2,
              map,
            });
          }

          if (nextPath.length >= 3) {
            setPolygonPath(nextPath, map);
            drawingEnabledRef.current = false;
          }
        });

        if (initialPath.length >= 3) {
          clearPolygon();
          clearPreviewLine();
          setPolygonPath(initialPath, map);
          const bounds = new window.google.maps.LatLngBounds();
          initialPath.forEach((point) => bounds.extend(point));
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
          }
        }

        setLoadState("ready");
      })
      .catch((loadError: unknown) => {
        console.error("Google Maps service area editor initialization failed.", loadError);
        setError(getFriendlyGoogleMapsError(loadError));
        setLoadState("error");
      });

    return () => {
      active = false;
      mapClickListenerRef.current?.remove?.();
      mapClickListenerRef.current = null;

      if (window.google?.maps?.event) {
        if (polygonRef.current) {
          window.google.maps.event.clearInstanceListeners(polygonRef.current);
        }
        if (previewLineRef.current) {
          window.google.maps.event.clearInstanceListeners(previewLineRef.current);
        }
        if (mapRef.current) {
          window.google.maps.event.clearInstanceListeners(mapRef.current);
        }
      }
    };
  }, [initialPath.length]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps || !addressHint?.trim()) {
      return;
    }

    geocoderRef.current = geocoderRef.current ?? new window.google.maps.Geocoder();

    geocoderRef.current.geocode({ address: addressHint.trim() }, (results: any[], status: string) => {
      if (!window.google?.maps || !mapRef.current) {
        return;
      }

      if (status === "OK" && results?.[0]?.geometry?.location) {
        mapRef.current.setCenter(results[0].geometry.location);
      }
    });
  }, [addressHint]);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
        <div className="text-muted fs-7">
          Click on the map to place coverage points. After 3 points the area becomes editable.
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => {
              clearPolygon();
              clearPreviewLine();
              drawingEnabledRef.current = true;
              onChange(null);
            }}
          >
            Redraw Area
          </button>
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => {
              clearPolygon();
              clearPreviewLine();
              drawingEnabledRef.current = false;
              onChange(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-warning mb-0">{error}</div> : null}

      <div className="position-relative rounded-4 overflow-hidden border bg-light" style={{ minHeight: 360 }}>
        {loadState !== "ready" ? (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1 }}>
            <div className="w-100 h-100 p-4">
              <div className="placeholder-glow h-100 d-flex flex-column gap-3">
                <span className="placeholder col-12 rounded-3 flex-grow-1" />
                <span className="placeholder col-8 rounded-3" style={{ height: 16 }} />
              </div>
            </div>
          </div>
        ) : null}
        <div id="briksy-service-area-editor" style={{ width: "100%", height: 360 }} />
      </div>

      {value ? (
        <div className="text-muted fs-7">
          Service area saved with {value.coordinates?.[0]?.length ?? 0} coordinate points.
        </div>
      ) : (
        <div className="text-muted fs-7">
          No service area geometry has been saved yet.
        </div>
      )}
    </div>
  );
};

export { ServiceAreaGeometryEditor };
