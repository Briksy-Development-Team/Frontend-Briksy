import { Link } from "react-router-dom";
import type { PropertyMapItem } from "./property-map.types";

type Props = {
  property: PropertyMapItem | null;
  portalBase: "/super-admin" | "/admin";
  onClose: () => void;
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PropertyMapPopup = ({ property, portalBase, onClose }: Props) => {
  if (!property) {
    return null;
  }

  const images = property.images ?? (property.image_url ? [{ url: property.image_url, is_primary: true }] : []);
  const videos = property.videos ?? [];
  const viewUrl = `${portalBase}/property-management/${property.id}`;
  const editUrl = `${portalBase}/property-management?edit=${property.id}`;

  return (
    <div
      className="position-absolute top-0 end-0 m-4 bg-white border rounded-3 shadow-lg"
      style={{ width: "min(440px, calc(100vw - 2rem))", zIndex: 3, maxHeight: "calc(100vh - 2rem)", overflow: "auto" }}
    >
      {images.length > 0 ? (
        <div className="border-bottom">
          <img
            src={images[0].url}
            alt={property.title}
            className="w-100"
            style={{ height: 220, objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
          />
        </div>
      ) : (
        <div className="w-100 bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: 220 }}>
          No image available
        </div>
      )}

      <div className="p-4">
        <div className="d-flex justify-content-between gap-3 align-items-start mb-3">
          <div className="min-w-0">
            <div className="text-uppercase text-muted fs-8 fw-semibold">Property</div>
            <div className="fw-bold fs-5 text-truncate">{property.title}</div>
            <div className="text-muted fs-7 text-truncate">{property.property_number}</div>
          </div>

          <button type="button" className="btn btn-sm btn-light btn-icon" onClick={onClose} aria-label="Close property popup">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="badge badge-light-primary">{property.status}</span>
          <span className={`badge ${property.verified ? "badge-light-success" : "badge-light-warning"}`}>
            {property.verified ? "Verified" : "Unverified"}
          </span>
        </div>

        <div className="text-gray-700 fs-7 mb-3">
          <div className="mb-1">{property.organization_name ?? "—"}</div>
          <div className="mb-1">{property.property_type ?? "—"}</div>
          <div className="mb-1">{property.address ?? "—"}</div>
          <div>{[property.city, property.state, property.country].filter(Boolean).join(", ") || "—"}</div>
          <div className="text-muted mt-2">Created {formatDate(property.created_at)}</div>
        </div>

        <div className="mb-3">
          <div className="text-uppercase text-muted fs-8 fw-semibold mb-2">Media</div>

          {images.length === 0 && videos.length === 0 ? (
            <div className="alert alert-light mb-0">No images or videos uploaded.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {images.length > 0 ? (
                <div className="d-grid gap-2" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                  {images.map((media, index) => (
                    <a
                      key={`${media.url}-${index}`}
                      href={media.url}
                      target="_blank"
                      rel="noreferrer"
                      className="d-block overflow-hidden rounded-3 border bg-light"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      <img
                        src={media.url}
                        alt={`${property.title} image ${index + 1}`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </a>
                  ))}
                </div>
              ) : null}

              {videos.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {videos.map((media, index) => (
                    <div key={`${media.url}-${index}`} className="rounded-3 border bg-dark overflow-hidden">
                      <video controls preload="metadata" className="w-100 d-block" style={{ maxHeight: 220 }}>
                        <source src={media.url} />
                      </video>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="d-flex gap-2">
          <Link to={viewUrl} className="btn btn-sm btn-primary flex-grow-1">
            View Property
          </Link>
          <Link to={editUrl} className="btn btn-sm btn-light flex-grow-1">
            Edit Property
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyMapPopup;
