import { useEffect, useMemo, useState } from "react";
import { loadGoogleMapsScript } from "./googleMapsLoader";
import { PropertyMapMarker } from "./PropertyMapMarker";
import { PropertyMapInfoWindow } from "./PropertyMapInfoWindow";
import type { PropertyList } from "../properties/property.types";

type Props = {
  properties: PropertyList[];
  missingLocationCount?: number;
};

type Cluster = {
  id: string;
  latitude: number;
  longitude: number;
  properties: PropertyList[];
};

const AUSTRALIA_CENTER = { lat: -25.2744, lng: 133.7751 };

const isValidPoint = (property: PropertyList) =>
  typeof property.latitude === "number" &&
  typeof property.longitude === "number" &&
  Number.isFinite(property.latitude) &&
  Number.isFinite(property.longitude);

const buildClusters = (properties: PropertyList[], zoom: number): Cluster[] => {
  if (properties.length === 0) {
    return [];
  }

  const precision = zoom >= 12 ? 4 : zoom >= 9 ? 3 : 2;
  const clusters = new Map<string, PropertyList[]>();

  properties.forEach((property) => {
    const lat = property.latitude ?? 0;
    const lng = property.longitude ?? 0;
    const key = `${lat.toFixed(precision)}:${lng.toFixed(precision)}`;
    const items = clusters.get(key) ?? [];
    items.push(property);
    clusters.set(key, items);
  });

  return Array.from(clusters.entries()).map(([key, items]) => {
    const totals = items.reduce(
      (acc, property) => ({
        lat: acc.lat + (property.latitude ?? 0),
        lng: acc.lng + (property.longitude ?? 0),
      }),
      { lat: 0, lng: 0 },
    );

    return {
      id: key,
      latitude: totals.lat / items.length,
      longitude: totals.lng / items.length,
      properties: items,
    };
  });
};

const GoogleMapView = ({ properties, missingLocationCount = 0 }: Props) => {
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyList | null>(null);
  const [zoom, setZoom] = useState(6);

  const validProperties = useMemo(() => properties.filter(isValidPoint), [properties]);
  const clusters = useMemo(() => buildClusters(validProperties, zoom), [validProperties, zoom]);

  useEffect(() => {
    let active = true;

    loadGoogleMapsScript()
      .then(() => {
        if (!active) {
          return;
        }

        setGoogleMaps(window.google);

        const element = document.getElementById("briksy-google-map");

        if (!element) {
          setLoadError("Map container not found.");
          return;
        }

        const nextMap = new window.google.maps.Map(element, {
          center: validProperties[0]
            ? { lat: validProperties[0].latitude ?? AUSTRALIA_CENTER.lat, lng: validProperties[0].longitude ?? AUSTRALIA_CENTER.lng }
            : AUSTRALIA_CENTER,
          zoom: validProperties.length > 1 ? 6 : 10,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        nextMap.addListener("zoom_changed", () => {
          const currentZoom = nextMap.getZoom() ?? 6;
          setZoom(currentZoom);
        });

        setMap(nextMap);
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Google Maps could not be loaded.");
      });

    return () => {
      active = false;
    };
  }, [validProperties]);

  useEffect(() => {
    if (!map || !googleMaps) {
      return;
    }

    const bounds = new googleMaps.maps.LatLngBounds();

    clusters.forEach((cluster) => {
      bounds.extend({ lat: cluster.latitude, lng: cluster.longitude });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  }, [clusters, googleMaps, map]);

  if (loadError) {
    return <div className="alert alert-danger mb-0">{loadError}</div>;
  }

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()) {
    return <div className="alert alert-warning mb-0">VITE_GOOGLE_MAPS_API_KEY is missing. Google Maps cannot be displayed.</div>;
  }

  return (
    <div className="position-relative rounded-4 overflow-hidden border bg-light" style={{ minHeight: 640 }}>
      <div id="briksy-google-map" style={{ width: "100%", height: 640 }} />

      {map && googleMaps
        ? clusters.map((cluster) => (
            <PropertyMapMarker
              key={cluster.id}
              map={map}
              googleMaps={googleMaps}
              property={{
                ...cluster.properties[0],
                latitude: cluster.latitude,
                longitude: cluster.longitude,
                title:
                  cluster.properties.length > 1
                    ? `${cluster.properties.length} properties`
                    : cluster.properties[0].title,
              }}
              label={cluster.properties.length > 1 ? String(cluster.properties.length) : undefined}
              onClick={() => {
                if (cluster.properties.length > 1) {
                  map.setZoom(Math.min((map.getZoom() ?? zoom) + 2, 18));
                  map.panTo({ lat: cluster.latitude, lng: cluster.longitude });
                  return;
                }

                setSelectedProperty(cluster.properties[0]);
              }}
            />
          ))
        : null}

      <PropertyMapInfoWindow property={selectedProperty} onClose={() => setSelectedProperty(null)} />

      <div className="position-absolute bottom-0 start-0 m-4 bg-white border rounded-4 shadow-sm px-3 py-2">
        <div className="d-flex flex-column">
          <span className="fw-semibold">{validProperties.length} mapped properties</span>
          <span className="text-muted fs-8">{missingLocationCount} properties are missing coordinates.</span>
        </div>
      </div>
    </div>
  );
};

export { GoogleMapView };
