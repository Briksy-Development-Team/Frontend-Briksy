import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard } from "../../../_metronic/helpers";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import axiosInstance from "../../services/api/axiosInstance";

type Amenity = { id: string; group_id: string; name: string; slug: string; sort_order: number; is_active: boolean };
type Group = { id: string; name: string; features: Amenity[] };
type Envelope = { data: Group[] };
const blank = { group_id: "", name: "", slug: "", sort_order: 0, is_active: true };

const PropertyAmenitiesPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [editing, setEditing] = useState<Amenity | null>(null);
  const [form, setForm] = useState(blank);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { const response = await axiosInstance.get<Envelope>("/super-admin/property-amenities"); setGroups(response.data.data ?? []); setError(null); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load property amenities."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const openCreate = (groupId = groups[0]?.id ?? "") => { setEditing(null); setForm({ ...blank, group_id: groupId }); setOpen(true); };
  const openEdit = (amenity: Amenity) => { setEditing(amenity); setForm({ group_id: amenity.group_id, name: amenity.name, slug: amenity.slug, sort_order: amenity.sort_order, is_active: amenity.is_active }); setOpen(true); };
  const save = async () => { setSaving(true); try { const payload = { ...form, sort_order: Number(form.sort_order) || 0 }; if (editing) await axiosInstance.put(`/super-admin/property-amenities/${editing.id}`, payload); else await axiosInstance.post("/super-admin/property-amenities", payload); setOpen(false); await load(); } finally { setSaving(false); } };
  const remove = async (amenity: Amenity) => { if (!window.confirm(`Delete or deactivate ${amenity.name}?`)) return; await axiosInstance.delete(`/super-admin/property-amenities/${amenity.id}`); await load(); };

  return <Content>
    <PageHeader title="Property Amenities / Facilities" subtitle="Manage the active amenity options available to property teams." />
    <KTCard>
      <div className="card-header border-0 pt-6"><h3 className="card-title">Amenities</h3><div className="card-toolbar"><button className="btn btn-primary" type="button" onClick={() => openCreate()}>Add amenity</button></div></div>
      <div className="card-body py-4">{error && <div className="alert alert-danger">{error}</div>}{loading ? <div className="text-muted">Loading amenities...</div> : groups.map((group) => <div className="mb-8" key={group.id}><div className="d-flex justify-content-between align-items-center mb-3"><h4 className="mb-0">{group.name}</h4><button className="btn btn-sm btn-light-primary" type="button" onClick={() => openCreate(group.id)}>Add to category</button></div><div className="table-responsive"><table className="table align-middle table-row-dashed fs-6 gy-4"><thead><tr><th>Name</th><th>Slug</th><th>Status</th><th>Order</th><th className="text-end">Actions</th></tr></thead><tbody>{group.features.map((amenity) => <tr key={amenity.id}><td>{amenity.name}</td><td>{amenity.slug}</td><td><span className={`badge ${amenity.is_active ? "badge-light-success" : "badge-light-secondary"}`}>{amenity.is_active ? "Active" : "Inactive"}</span></td><td>{amenity.sort_order}</td><td className="text-end"><button className="btn btn-sm btn-light-primary me-2" type="button" onClick={() => openEdit(amenity)}>Edit</button><button className="btn btn-sm btn-light-danger" type="button" onClick={() => void remove(amenity)}>Delete</button></td></tr>)}</tbody></table></div></div>)}</div>
    </KTCard>
    {open && <ModalShell title={editing ? "Edit property amenity" : "Add property amenity"} onClose={() => setOpen(false)} onSubmit={save} isSubmitting={saving} isValid={Boolean(form.group_id && form.name.trim())}>
      <div className="mb-5"><label className="form-label">Category</label><select className="form-select" value={form.group_id} onChange={(event) => setForm({ ...form, group_id: event.target.value })}>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></div>
      <div className="mb-5"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
      <div className="row"><div className="col-md-6 mb-5"><label className="form-label">Slug <span className="text-muted">(optional)</span></label><input className="form-control" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></div><div className="col-md-6 mb-5"><label className="form-label">Sort order</label><input type="number" min="0" className="form-control" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} /></div></div>
      <label className="form-check form-switch form-check-custom form-check-solid"><input className="form-check-input" type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /><span className="form-check-label">Active</span></label>
    </ModalShell>}
  </Content>;
};

export default PropertyAmenitiesPage;
