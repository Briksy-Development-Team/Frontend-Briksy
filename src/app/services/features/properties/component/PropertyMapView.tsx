import type { PropertyList } from "../property.types";
import PropertyMap from "../../maps/PropertyMap";

type Props = {
  properties: PropertyList[];
};

const PropertyMapView = ({ properties }: Props) => {
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
      />
    </div>
  );
};

export default PropertyMapView;
