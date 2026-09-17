import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Property } from "../../types/property";
import PropertyListCard from "../cards/property/PropertyListCard";
import { loadGoogleMapsScript } from "../../utils/googleMapsLoader";

type Props = {
  properties: Property[];
};

type GoogleMap = {
  fitBounds: (bounds: GoogleLatLngBounds, padding?: number) => void;
};

type GoogleMarker = {
  setMap: (map: GoogleMap | null) => void;
  addListener: (event: string, handler: () => void) => void;
};

type GoogleLatLngBounds = {
  extend: (position: { lat: number; lng: number }) => void;
};

type GoogleMapsApi = {
  maps: {
    Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMap;
    Marker: new (options: Record<string, unknown>) => GoogleMarker;
    LatLngBounds: new () => GoogleLatLngBounds;
    event?: { clearInstanceListeners: (instance: GoogleMarker) => void };
  };
};

const getGoogleMaps = () => (window as unknown as { google?: GoogleMapsApi }).google;

const PropertyResultsMap = ({ properties }: Props) => {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const locatedProperties = useMemo(
    () => properties.filter((property) => Number.isFinite(property.lat) && Number.isFinite(property.lng) && property.lat !== 0 && property.lng !== 0),
    [properties],
  );

  useEffect(() => {
    let active = true;

    loadGoogleMapsScript([])
      .then(() => {
        const googleMaps = getGoogleMaps();
        if (!active || !mapElementRef.current || !googleMaps?.maps) return;

        mapRef.current = new googleMaps.maps.Map(mapElementRef.current, {
          center: { lat: -25.2744, lng: 133.7751 },
          zoom: 4,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });
        setMapReady(true);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Google Maps could not be loaded.");
      });

    return () => {
      active = false;
      markersRef.current.forEach((marker) => getGoogleMaps()?.maps?.event?.clearInstanceListeners(marker));
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const googleMaps = getGoogleMaps();
    if (!map || !googleMaps?.maps) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = locatedProperties.map((property) => {
      const marker = new googleMaps.maps.Marker({
        map,
        position: { lat: property.lat, lng: property.lng },
        title: property.title,
      });
      marker.addListener("click", () => setSelectedProperty(property));
      return marker;
    });

    if (locatedProperties.length > 0) {
      const bounds = new googleMaps.maps.LatLngBounds();
      locatedProperties.forEach((property) => bounds.extend({ lat: property.lat, lng: property.lng }));
      map.fitBounds(bounds, 48);
    }

    return () => markersRef.current.forEach((marker) => marker.setMap(null));
  }, [locatedProperties, mapReady]);

  if (error) {
    return <div className="flex h-full items-center justify-center bg-[#F0EBE4] p-6 text-center text-sm text-[#8B6F54]">{error}</div>;
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapElementRef} className="h-full w-full" aria-label="Property map" />
      {selectedProperty && (
        <div className="absolute right-4 top-4 z-10 w-[min(25rem,calc(100%-2rem))] rounded-[1.25rem] bg-white shadow-xl">
          <button
            type="button"
            onClick={() => setSelectedProperty(null)}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary-brown shadow"
            aria-label="Close property details"
          >
            <X size={17} />
          </button>
          <PropertyListCard item={selectedProperty} />
        </div>
      )}
    </div>
  );
};

export default PropertyResultsMap;
