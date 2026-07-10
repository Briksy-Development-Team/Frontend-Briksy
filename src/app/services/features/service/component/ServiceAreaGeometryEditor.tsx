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
  const drawingManagerRef = useRef<any>(null);
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

        if (addressHint?.trim()) {
          geocoderRef.current.geocode({ address: addressHint.trim() }, (results: any[], status: string) => {
            if (!active || !mapRef.current) {
              return;
            }

            if (status === "OK" && results?.[0]?.geometry?.location) {
              mapRef.current.setCenter(results[0].geometry.location);
            }
          });
        }

        if (polygonRef.current) {
          clearPathListeners();
          polygonRef.current.setMap(null);
          polygonRef.current = null;
        }

        if (initialPath.length >= 3) {
          polygonRef.current = new window.google.maps.Polygon({
            paths: initialPath,
            editable: true,
            draggable: true,
            fillColor: "#0d6efd",
            fillOpacity: 0.2,
            strokeColor: "#0d6efd",
            strokeWeight: 2,
          });
          polygonRef.current.setMap(map);

          const path = polygonRef.current.getPath();
          listenersRef.current.push(
            path.addListener("insert_at", () => syncGeometryFromPolygon(polygonRef.current)),
            path.addListener("set_at", () => syncGeometryFromPolygon(polygonRef.current)),
            polygonRef.current.addListener("dragend", () => syncGeometryFromPolygon(polygonRef.current)),
          );

          const bounds = new window.google.maps.LatLngBounds();
          initialPath.forEach((point) => bounds.extend(point));
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
          }
        }

        if (!drawingManagerRef.current) {
          drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
            drawingMode: initialPath.length >= 3 ? null : window.google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
            },
            polygonOptions: {
              editable: true,
              draggable: true,
              fillColor: "#0d6efd",
              fillOpacity: 0.2,
              strokeColor: "#0d6efd",
              strokeWeight: 2,
            },
          });

          drawingManagerRef.current.setMap(map);

          drawingManagerRef.current.addListener("overlaycomplete", (event: any) => {
            if (event.type !== window.google.maps.drawing.OverlayType.POLYGON) {
              return;
            }

            if (polygonRef.current) {
              clearPathListeners();
              polygonRef.current.setMap(null);
            }

            polygonRef.current = event.overlay;
            drawingManagerRef.current.setDrawingMode(null);

            const path = polygonRef.current.getPath();
            listenersRef.current.push(
              path.addListener("insert_at", () => syncGeometryFromPolygon(polygonRef.current)),
              path.addListener("set_at", () => syncGeometryFromPolygon(polygonRef.current)),
              polygonRef.current.addListener("dragend", () => syncGeometryFromPolygon(polygonRef.current)),
            );

            syncGeometryFromPolygon(polygonRef.current);
          });
        } else {
          drawingManagerRef.current.setMap(map);
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
      clearPathListeners();

      if (window.google?.maps?.event) {
        if (polygonRef.current) {
          window.google.maps.event.clearInstanceListeners(polygonRef.current);
        }
        if (drawingManagerRef.current) {
          window.google.maps.event.clearInstanceListeners(drawingManagerRef.current);
        }
        if (mapRef.current) {
          window.google.maps.event.clearInstanceListeners(mapRef.current);
        }
      }
    };
  }, [addressHint, initialPath]);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
        <div className="text-muted fs-7">
          Draw the service coverage area with the map tools. The area is stored as GeoJSON.
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => {
              if (polygonRef.current) {
                clearPathListeners();
                polygonRef.current.setMap(null);
                polygonRef.current = null;
              }

              onChange(null);
              drawingManagerRef.current?.setDrawingMode(window.google?.maps?.drawing?.OverlayType.POLYGON ?? null);
            }}
          >
            Redraw Area
          </button>
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => {
              if (polygonRef.current) {
                clearPathListeners();
                polygonRef.current.setMap(null);
                polygonRef.current = null;
              }

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
