import type { PropertyList } from "../property.types";
import { GoogleMapView } from "../../maps/GoogleMapView";

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
      <GoogleMapView properties={mappedProperties} missingLocationCount={missingLocationCount} />
    </div>
  );
};

export default PropertyMapView;
