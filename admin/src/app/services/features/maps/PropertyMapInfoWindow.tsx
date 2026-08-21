import { Link } from "react-router-dom";
import type { PropertyList } from "../properties/property.types";
import { getRolePortalBaseRoute } from "../../../modules/auth/core/roleRoutes";
import { useRoleAccess } from "../../../modules/auth";

type Props = {
  property: PropertyList | null;
  onClose: () => void;
};

const PropertyMapInfoWindow = ({ property, onClose }: Props) => {
  const { isSuperAdmin } = useRoleAccess();
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ["super_admin"] : ["admin"]);

  if (!property) {
    return null;
  }

  const quickViewUrl = `${portalBase}/property-management?highlight=${property.id}`;
  const address = property.formatted_address ?? property.full_address ?? property.address ?? "No address saved";

  return (
    <div className="position-absolute top-0 end-0 m-4 shadow-lg border rounded-4 bg-white p-4" style={{ maxWidth: 340, zIndex: 5 }}>
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <div className="text-muted fs-8 text-uppercase fw-semibold">Selected property</div>
          <h4 className="mb-0 fw-bold fs-5">{property.title}</h4>
        </div>
        <button type="button" className="btn btn-sm btn-light btn-icon" onClick={onClose} aria-label="Close property info">
          <i className="bi bi-x-lg" />
        </button>
      </div>

      <div className="text-gray-700 fs-7 mb-2">{address}</div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="badge badge-light-primary">{property.status}</span>
        {property.organization?.name ? <span className="badge badge-light-info">{property.organization.name}</span> : null}
        {property.property_type?.name ? <span className="badge badge-light">{property.property_type.name}</span> : null}
      </div>

      <div className="d-flex gap-2">
        <Link to={quickViewUrl} className="btn btn-sm btn-primary">
          Quick view
        </Link>
        <Link to={`${portalBase}/property-management?edit=${property.id}`} className="btn btn-sm btn-light">
          Edit
        </Link>
      </div>
    </div>
  );
};

export { PropertyMapInfoWindow };
