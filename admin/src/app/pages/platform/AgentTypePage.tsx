import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard } from "../../../_metronic/helpers";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import axiosInstance from "../../services/api/axiosInstance";

type PlanFamily = "property_owner" | "trades_professional" | "buyers_agent" | "builders";
type AgentType = { id: string; name: string; slug: string; label?: string; display_name?: string | null; capability_profile?: string | null; plan_family?: PlanFamily | null; is_active: boolean; sort_order: number };
type Envelope = { data: AgentType[] };
const emptyForm = { name: "", slug: "", display_name: "", capability_profile: "", plan_family: "buyers_agent" as PlanFamily, is_active: true, sort_order: 0 };

const familyLabels: Record<PlanFamily, string> = {
  property_owner: "Real Estate",
  trades_professional: "Traders & Professionals",
  buyers_agent: "Agents",
  builders: "Builder",
};

export default function AgentTypePage() {
  const [types, setTypes] = useState<AgentType[]>([]);
  const [editing, setEditing] = useState<AgentType | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Envelope>("/super-admin/organization-types", { params: { per_page: 100, "filter[module]": "Agents", sort: "sort_order", direction: "asc" } });
      setTypes(response.data.data ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const edit = (type?: AgentType) => {
    setEditing(type ?? null);
    setForm(type ? { name: type.name, slug: type.slug, display_name: type.display_name ?? type.label ?? "", capability_profile: type.capability_profile ?? "", plan_family: type.plan_family ?? "buyers_agent", is_active: type.is_active, sort_order: type.sort_order } : emptyForm);
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, module: "Agents", sort_order: Number(form.sort_order) || 0 };
      if (editing) await axiosInstance.put(`/super-admin/organization-types/${editing.id}`, payload);
      else await axiosInstance.post("/super-admin/organization-types", payload);
      setOpen(false);
      await load();
    } finally { setSaving(false); }
  };

  return <Content>
    <PageHeader title="Agent Types" subtitle="Manage the active categories shown under Agents." />
    <KTCard>
      <div className="card-header border-0 pt-6"><h3 className="card-title">Agents</h3><div className="card-toolbar"><button className="btn btn-primary" type="button" onClick={() => edit()}>Add Agent Type</button></div></div>
      <div className="card-body py-4">{loading ? <div className="text-muted">Loading Agent types...</div> : <div className="table-responsive"><table className="table align-middle table-row-dashed fs-6 gy-5"><thead><tr><th>Name</th><th>Slug</th><th>Pricing plans</th><th>Status</th><th>Order</th><th /></tr></thead><tbody>{types.map((type) => <tr key={type.id}><td>{type.display_name || type.label || type.name}</td><td>{type.slug}</td><td>{type.plan_family ? familyLabels[type.plan_family] : <span className="text-muted">Not configured</span>}</td><td><span className={`badge ${type.is_active ? "badge-light-success" : "badge-light-secondary"}`}>{type.is_active ? "Active" : "Inactive"}</span></td><td>{type.sort_order}</td><td className="text-end"><button className="btn btn-sm btn-light-primary" type="button" onClick={() => edit(type)}>Edit</button></td></tr>)}</tbody></table></div>}</div>
    </KTCard>
    {open && <ModalShell title={editing ? "Edit Agent Type" : "Add Agent Type"} onClose={() => setOpen(false)} onSubmit={save} isSubmitting={saving} isValid={Boolean(form.name.trim() && form.slug.trim())}>
      <div className="mb-5"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
      <div className="mb-5"><label className="form-label">Slug</label><input className="form-control" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} disabled={Boolean(editing)} /></div>
      <div className="mb-5"><label className="form-label">Display label</label><input className="form-control" value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} /></div>
      <div className="mb-5"><label className="form-label">Capability profile</label><input className="form-control" value={form.capability_profile} onChange={(event) => setForm({ ...form, capability_profile: event.target.value })} placeholder="Optional" /></div>
      <div className="mb-5"><label className="form-label">Pricing plans</label><select className="form-select" value={form.plan_family} onChange={(event) => setForm({ ...form, plan_family: event.target.value as PlanFamily })}><option value="buyers_agent">Agents</option>{(Object.keys(familyLabels) as PlanFamily[]).filter((family) => family !== "buyers_agent").map((family) => <option key={family} value={family}>{familyLabels[family]}</option>)}</select><div className="form-text">All organizations using this type can only use plans from this pricing group.</div></div>
      <div className="row"><div className="col-md-6 mb-5"><label className="form-label">Sort order</label><input type="number" className="form-control" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} /></div><div className="col-md-6 mb-5 d-flex align-items-end"><label className="form-check form-switch form-check-custom form-check-solid"><input className="form-check-input" type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /><span className="form-check-label">Visible publicly</span></label></div></div>
    </ModalShell>}
  </Content>;
}
