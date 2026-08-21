import { useEffect } from "react";
import type { PropertyList } from "../properties/property.types";

type Props = {
  map: any;
  googleMaps: any;
  property: PropertyList;
  onClick?: (property: PropertyList) => void;
  label?: string;
};

const PropertyMapMarker = ({ map, googleMaps, property, onClick, label }: Props) => {
  useEffect(() => {
    if (!map || !googleMaps || property.latitude === null || property.longitude === null) {
      return;
    }

    const marker = new googleMaps.maps.Marker({
      map,
      position: { lat: property.latitude, lng: property.longitude },
      title: property.title,
      label,
    });

    if (onClick) {
      marker.addListener("click", () => onClick(property));
    }

    return () => {
      marker.setMap(null);
      googleMaps.maps.event.clearInstanceListeners(marker);
    };
  }, [googleMaps, label, map, onClick, property]);

  return null;
};

export { PropertyMapMarker };
