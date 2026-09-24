import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { fetchServiceGroupApi } from "../../services/features/service/service_list.api";
import {
  deleteServiceOfferApi,
  fetchServiceOffersApi,
  saveServiceOfferApi,
  toggleServiceOfferApi,
  type ServiceOffer,
} from "../../services/features/service/service_offers.api";

type OfferForm = Partial<ServiceOffer> & { highlights_text?: string };
const emptyOffer: OfferForm = { title: "", service_id: "", tag_label: "", summary: "", description: "", highlights_text: "", terms: "", is_active: true, sort_order: 0 };

export default function ServiceOffersPage() {
  const [items, setItems] = useState<ServiceOffer[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [editing, setEditing] = useState<OfferForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [offers, serviceResponse] = await Promise.all([
        fetchServiceOffersApi(),
        fetchServiceGroupApi({ per_page: 100, sort: "name", direction: "asc" }),
      ]);
      setItems(offers);
      setServices(serviceResponse.data);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Failed to load service offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const submit = async () => {
    if (!editing?.title || !editing.service_id) return;
    setSaving(true);
    try {
      await saveServiceOfferApi({
        ...editing,
        service_id: editing.service_id,
        title: editing.title,
        tag_label: editing.tag_label?.trim() || null,
        highlights: editing.highlights_text ? editing.highlights_text.split("\n").map((line) => line.trim()).filter(Boolean) : editing.highlights ?? [],
      }, editing.id);
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Unable to save service offer.");
    } finally {
      setSaving(false);
    }
  };

  const serviceOptions = useMemo(() => services.map((service) => ({ id: service.id, label: `${service.name}${service.category ? ` — ${service.category}` : ""}` })), [services]);

  return (
    <Content>
      <PageHeader title="Service Offers" subtitle="Create promotional offers for services" />
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="fw-semibold">Offers</div>
          <button className="btn btn-primary" onClick={() => setEditing({ ...emptyOffer })}>New Offer</button>
        </div>
        <div className="card-body">
          {loading ? <div className="text-muted">Loading...</div> : null}
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="table-responsive">
            <table className="table align-middle table-row-bordered">
              <thead><tr className="text-muted fs-7 text-uppercase"><th>Title</th><th>Service</th><th>Tag</th><th>Order</th><th>Status</th><th /></tr></thead>
              <tbody>{items.map((offer) => (
                <tr key={offer.id}>
                  <td className="fw-semibold">{offer.title}</td><td>{offer.service?.name ?? offer.service_id}</td><td>{offer.tag_label ?? "—"}</td><td>{offer.sort_order}</td><td>{offer.is_active ? "Active" : "Inactive"}</td>
                  <td className="text-end"><div className="dropdown dropup position-static"><button type="button" className="btn btn-sm btn-light" data-bs-toggle="dropdown">Actions</button><ul className="dropdown-menu dropdown-menu-end">
                    <li><button type="button" className="dropdown-item" onClick={() => setEditing({ ...offer, highlights_text: offer.highlights?.join("\n") ?? "" })}>Edit</button></li>
                    <li><button type="button" className="dropdown-item" onClick={async () => { await toggleServiceOfferApi(offer.id, !offer.is_active); await load(); }}>Toggle</button></li>
                    <li><button type="button" className="dropdown-item text-danger" onClick={async () => { await deleteServiceOfferApi(offer.id); await load(); }}>Delete</button></li>
                  </ul></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
      {editing ? <ModalShell title={editing.id ? "Edit Offer" : "New Offer"} onClose={() => setEditing(null)} onSubmit={submit} submitLabel={saving ? "Saving..." : "Save"} isSubmitting={saving} isValid={!!editing.title && !!editing.service_id}>
        <div className="row g-5">
          <div className="col-md-6"><label className="form-label">Title</label><input className="form-control form-control-solid" value={editing.title ?? ""} onChange={(e) => setEditing((current) => ({ ...current, title: e.target.value }))} /></div>
          <div className="col-md-6"><label className="form-label">Service</label><select className="form-select form-select-solid" value={editing.service_id ?? ""} onChange={(e) => setEditing((current) => ({ ...current, service_id: e.target.value }))}><option value="">Select service</option>{serviceOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></div>
          <div className="col-md-6"><label className="form-label">Tag Label</label><input className="form-control form-control-solid" placeholder="Optional" value={editing.tag_label ?? ""} onChange={(e) => setEditing((current) => ({ ...current, tag_label: e.target.value }))} /></div>
          <div className="col-md-3"><label className="form-label">Sort Order</label><input type="number" className="form-control form-control-solid" value={editing.sort_order ?? 0} onChange={(e) => setEditing((current) => ({ ...current, sort_order: Number(e.target.value) }))} /></div>
          <div className="col-md-3"><label className="form-label">Active</label><select className="form-select form-select-solid" value={editing.is_active ? "1" : "0"} onChange={(e) => setEditing((current) => ({ ...current, is_active: e.target.value === "1" }))}><option value="1">Yes</option><option value="0">No</option></select></div>
          <div className="col-12"><label className="form-label">Summary</label><input className="form-control form-control-solid" value={editing.summary ?? ""} onChange={(e) => setEditing((current) => ({ ...current, summary: e.target.value }))} /></div>
          <div className="col-12"><label className="form-label">Description</label><textarea rows={4} className="form-control form-control-solid" value={editing.description ?? ""} onChange={(e) => setEditing((current) => ({ ...current, description: e.target.value }))} /></div>
          <div className="col-12"><label className="form-label">What&apos;s Included</label><textarea rows={4} className="form-control form-control-solid" value={editing.highlights_text ?? ""} onChange={(e) => setEditing((current) => ({ ...current, highlights_text: e.target.value }))} placeholder="Enter one item per line" /></div>
          <div className="col-12"><label className="form-label">Terms</label><textarea rows={3} className="form-control form-control-solid" value={editing.terms ?? ""} onChange={(e) => setEditing((current) => ({ ...current, terms: e.target.value }))} /></div>
        </div>
      </ModalShell> : null}
    </Content>
  );
}
