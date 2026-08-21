import { Link } from "react-router-dom";
import type { ServiceMapItem } from "./service-map.types";
import { getRolePortalBaseRoute, useRoleAccess } from "../../../modules/auth";

type Props = {
  service: ServiceMapItem | null;
  onClose: () => void;
};

const ServiceCoveragePopup = ({ service, onClose }: Props) => {
  const { isSuperAdmin } = useRoleAccess();
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ["super_admin"] : ["admin"]);

  if (!service) {
    return null;
  }

  const viewUrl = `${portalBase}/services/detail/${service.id}`;
  const editUrl = `${portalBase}/services?edit=${service.id}`;

  return (
    <div className="position-absolute top-0 end-0 m-4 shadow-lg border rounded-4 bg-white p-4" style={{ maxWidth: 360, zIndex: 5 }}>
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <div className="text-muted fs-8 text-uppercase fw-semibold">Service coverage</div>
          <h4 className="mb-0 fw-bold fs-5">{service.title ?? service.name}</h4>
        </div>
        <button type="button" className="btn btn-sm btn-light btn-icon" onClick={onClose} aria-label="Close service info">
          <i className="bi bi-x-lg" />
        </button>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="badge badge-light-primary">{service.status ?? (service.is_active ? "Active" : "Inactive")}</span>
        {service.organization?.name ? <span className="badge badge-light-info">{service.organization.name}</span> : null}
        {service.category ? <span className="badge badge-light">{service.category}</span> : null}
      </div>

      <div className="text-gray-700 fs-7 mb-3">
        <div className="mb-1">Provider: {service.organization?.name ?? "—"}</div>
        <div className="mb-1">Coverage: {service.service_area ?? "Custom region"}</div>
        <div className="mb-1">Rate: {service.rate_from ?? "—"} - {service.rate_to ?? "—"}</div>
        <div>Status: {service.status ?? (service.is_active ? "Active" : "Inactive")}</div>
      </div>

      <div className="d-flex gap-2">
        <Link to={viewUrl} className="btn btn-sm btn-primary">
          Quick view
        </Link>
        <Link to={editUrl} className="btn btn-sm btn-light">
          Edit
        </Link>
      </div>
    </div>
  );
};

export { ServiceCoveragePopup };
