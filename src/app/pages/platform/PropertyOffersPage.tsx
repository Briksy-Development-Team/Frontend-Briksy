import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import type { PropertyList, PropertyOffer } from "../../services/features/properties/property.types";
import { fetchPropertyListApi } from "../../services/features/properties/property.api";
import {
  deletePropertyOfferApi,
  fetchPropertyOffersApi,
  savePropertyOfferApi,
  togglePropertyOfferApi,
} from "../../services/features/offers/offers.api";

type OfferForm = Partial<PropertyOffer> & {
  highlights_text?: string;
};

const emptyOffer: OfferForm = {
  title: "",
  tag_label: "BRIKSY EXCLUSIVE",
  summary: "",
  description: "",
  highlights_text: "",
  terms: "",
  is_active: true,
  sort_order: 0,
};

export default function PropertyOffersPage() {
  const [items, setItems] = useState<PropertyOffer[]>([]);
  const [properties, setProperties] = useState<PropertyList[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<OfferForm | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [offers, propertyResponse] = await Promise.all([
        fetchPropertyOffersApi(),
        fetchPropertyListApi({ per_page: 200, sort: "created_at", direction: "desc" }),
      ]);

      setItems(offers);
      setProperties(propertyResponse.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load property offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const propertyOptions = useMemo(
    () => properties.map((property) => ({
      id: property.id,
      label: `${property.display_id ?? property.generated_id ?? property.id} - ${property.title}`,
    })),
    [properties],
  );

  const submit = async () => {
    if (!editing?.title || !editing.property_listing_id) {
      return;
    }

    setSaving(true);
    try {
      await savePropertyOfferApi(
        {
          ...editing,
          property_listing_id: editing.property_listing_id,
          title: editing.title,
          highlights: editing.highlights_text
            ? editing.highlights_text.split("\n").map((line) => line.trim()).filter(Boolean)
            : editing.highlights ?? [],
        },
        editing.id,
      );
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const selectedProperty = properties.find((property) => property.id === editing?.property_listing_id);

  return (
    <Content>
      <PageHeader title="Property Offers" subtitle="Create Briksy Exclusive offers for listings" />
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="fw-semibold">Offers</div>
          <button className="btn btn-primary" onClick={() => setEditing(emptyOffer)}>New Offer</button>
        </div>
        <div className="card-body">
          {loading ? <div className="text-muted">Loading...</div> : null}
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="table-responsive">
            <table className="table align-middle table-row-bordered">
              <thead>
                <tr className="text-muted fs-7 text-uppercase">
                  <th>Title</th>
                  <th>Property</th>
                  <th>Tag</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((offer) => (
                  <tr key={offer.id}>
                    <td className="fw-semibold">{offer.title}</td>
                    <td>{offer.property_listing?.title ?? offer.property_listing_id}</td>
                    <td>{offer.tag_label ?? "BRIKSY EXCLUSIVE"}</td>
                    <td>{offer.sort_order}</td>
                    <td>{offer.is_active ? "Active" : "Inactive"}</td>
                    <td className="text-end">
                      <div className="dropdown">
                        <button type="button" className="btn btn-sm btn-light btn-active-light-primary" data-bs-toggle="dropdown">
                          Actions
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button type="button" className="dropdown-item" onClick={() => setEditing({
                              ...offer,
                              highlights_text: Array.isArray(offer.highlights) ? offer.highlights.join("\n") : "",
                            })}>
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={async () => {
                                await togglePropertyOfferApi(offer.id, !offer.is_active);
                                await load();
                              }}
                            >
                              Toggle
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="dropdown-item text-danger"
                              onClick={async () => {
                                await deletePropertyOfferApi(offer.id);
                                await load();
                              }}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing ? (
        <ModalShell
          title={editing.id ? "Edit Offer" : "New Offer"}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          submitLabel={saving ? "Saving..." : "Save"}
          isValid={!!editing.title && !!editing.property_listing_id}
        >
          <div className="row g-5">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                className="form-control form-control-solid"
                value={editing.title ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, title: e.target.value }))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Property</label>
              <select
                className="form-select form-select-solid"
                value={editing.property_listing_id ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, property_listing_id: e.target.value }))}
              >
                <option value="">Select property</option>
                {propertyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedProperty ? (
                <div className="form-text">
                  {selectedProperty.full_address ?? selectedProperty.address ?? "Property selected"}
                </div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">Tag Label</label>
              <input
                className="form-control form-control-solid"
                value={editing.tag_label ?? "BRIKSY EXCLUSIVE"}
                onChange={(e) => setEditing((current) => ({ ...current, tag_label: e.target.value }))}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Sort Order</label>
              <input
                className="form-control form-control-solid"
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) => setEditing((current) => ({ ...current, sort_order: Number(e.target.value) }))}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Active</label>
              <select
                className="form-select form-select-solid"
                value={editing.is_active ? "1" : "0"}
                onChange={(e) => setEditing((current) => ({ ...current, is_active: e.target.value === "1" }))}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Summary</label>
              <input
                className="form-control form-control-solid"
                value={editing.summary ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, summary: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control form-control-solid"
                rows={4}
                value={editing.description ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, description: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <label className="form-label">What&apos;s Included</label>
              <textarea
                className="form-control form-control-solid"
                rows={4}
                value={editing.highlights_text ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, highlights_text: e.target.value }))}
                placeholder="Enter one item per line"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Terms</label>
              <textarea
                className="form-control form-control-solid"
                rows={3}
                value={editing.terms ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, terms: e.target.value }))}
              />
            </div>
          </div>
        </ModalShell>
      ) : null}
    </Content>
  );
}
