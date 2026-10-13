import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { BuyerBrief, BuyerBriefFormValues } from "../buyer_brief.types";

type Props = { initialValues?: BuyerBrief | null; isSubmitting?: boolean; onClose: () => void; onSubmit: (values: BuyerBriefFormValues) => void | Promise<unknown> };

const valuesFromBrief = (brief?: BuyerBrief | null): BuyerBriefFormValues => ({
  client_name: brief?.client_name ?? "",
  client_email: brief?.client_email ?? "",
  status: brief?.status ?? "active",
  budget_min: brief?.budget_min ? String(brief.budget_min) : "",
  budget_max: brief?.budget_max ? String(brief.budget_max) : "",
  preferred_locations: brief?.preferred_locations?.join(", ") ?? "",
  bedrooms: String(brief?.preferences?.bedrooms ?? ""),
  property_type: String(brief?.preferences?.property_type ?? ""),
  notes: brief?.notes ?? "",
});

export const BuyerBriefModal = ({ initialValues, isSubmitting = false, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState(() => valuesFromBrief(initialValues));
  useEffect(() => setForm(valuesFromBrief(initialValues)), [initialValues]);
  const update = (key: keyof BuyerBriefFormValues, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const field = (key: keyof BuyerBriefFormValues, label: string, type = "text") => (
    <div className="fv-row mb-4"><label className="form-label">{label}</label><input type={type} className="form-control form-control-solid" value={form[key]} onChange={(event) => update(key, event.target.value)} /></div>
  );

  return <ModalShell title={initialValues ? "Edit Buyer Brief" : "Add Buyer Brief"} onClose={onClose} onSubmit={() => onSubmit(form)} isSubmitting={isSubmitting} submitLabel={initialValues ? "Save Changes" : "Add Buyer Brief"} isValid={Boolean(form.client_name.trim())}>
    <div className="alert alert-light-info">Capture the client’s requirements so your team can manage the search consistently.</div>
    <div className="row"><div className="col-md-6">{field("client_name", "Client name")}</div><div className="col-md-6">{field("client_email", "Client email", "email")}</div></div>
    <div className="row"><div className="col-md-6">{field("budget_min", "Minimum budget", "number")}</div><div className="col-md-6">{field("budget_max", "Maximum budget", "number")}</div></div>
    <div className="row"><div className="col-md-6">{field("preferred_locations", "Preferred suburbs / areas")}</div><div className="col-md-6">{field("property_type", "Property type")}</div></div>
    <div className="row"><div className="col-md-6">{field("bedrooms", "Bedrooms")}</div><div className="col-md-6"><div className="fv-row mb-4"><label className="form-label">Status</label><select className="form-select form-select-solid" value={form.status} onChange={(event) => update("status", event.target.value)}><option value="active">Active</option><option value="shortlisted">Shortlisted</option><option value="matched">Matched</option><option value="closed">Closed</option></select></div></div></div>
    <div className="fv-row mb-2"><label className="form-label">Notes</label><textarea className="form-control form-control-solid" rows={4} value={form.notes} onChange={(event) => update("notes", event.target.value)} /></div>
  </ModalShell>;
};
