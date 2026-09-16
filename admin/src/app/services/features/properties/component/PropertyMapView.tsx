import { useEffect, useState } from "react";
import type { PropertyList } from "../property.types";
import PropertyMap from "../../maps/PropertyMap";
import PropertyMapPopup from "../../maps/PropertyMapPopup";
import type { PropertyMapItem } from "../../maps/property-map.types";

type Props = {
  properties: PropertyList[];
  portalBase: "/super-admin" | "/admin";
};

const PropertyMapView = ({ properties, portalBase }: Props) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyMapItem | null>(null);
  useEffect(() => {
    if (!selectedProperty) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProperty(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProperty]);
  const mappedProperties = properties.filter(
    (property) =>
      typeof property.latitude === "number" &&
      typeof property.longitude === "number" &&
      Number.isFinite(property.latitude) &&
      Number.isFinite(property.longitude),
  );

  const missingLocationCount = properties.length - mappedProperties.length;

  if (properties.length === 0) {
    return <div className="alert alert-light mb-0">No properties found for the current filters.</div>;
  }

  return (
    <div className="position-relative">
      <div className="d-flex flex-column gap-4">
        {missingLocationCount > 0 ? (
          <div className="alert alert-warning mb-0">
            {missingLocationCount} property{missingLocationCount === 1 ? "" : "ies"} do not have coordinates yet and are hidden from the map.
          </div>
        ) : null}
        <PropertyMap
          properties={mappedProperties.map((property) => ({
            id: property.id,
            property_number: property.display_id ?? property.generated_id ?? property.id,
            title: property.title,
            latitude: property.latitude ?? null,
            longitude: property.longitude ?? null,
            status: property.status,
            verified: Boolean(property.location_verified),
            organization_name: property.organization?.name ?? null,
            property_type: property.property_type?.name ?? null,
            city: property.suburb ?? null,
            state: property.state ?? null,
            country: property.country ?? null,
            image_url: property.images?.find((image) => image.is_primary)?.url ?? property.images?.[0]?.url ?? null,
            images: property.images,
            videos: property.videos,
            address: property.formatted_address ?? property.full_address ?? property.address ?? null,
            created_at: property.created_at ?? null,
          }))}
          height={640}
          onMarkerClick={(property) => setSelectedProperty(property)}
        />
      </div>

      {selectedProperty ? (
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ zIndex: 2, background: "rgba(15, 23, 42, 0.18)" }}
          onClick={() => setSelectedProperty(null)}
          role="presentation"
        >
          <div onClick={(event) => event.stopPropagation()}>
            <PropertyMapPopup
              property={selectedProperty}
              portalBase={portalBase}
              onClose={() => setSelectedProperty(null)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PropertyMapView;
