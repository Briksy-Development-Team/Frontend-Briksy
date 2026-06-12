import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard, KTIcon } from "../../../_metronic/helpers";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { useRoleAccess } from "../../modules/auth";
import type { PlanRequest, PlanRequestFormValues } from "../../services/features/plan_requests/plan-request.types";
import {
  approvePlanRequestApi,
  createPlanRequestApi,
  deletePlanRequestApi,
  fetchPlanRequestsApi,
  rejectPlanRequestApi,
} from "../../services/features/plan_requests/plan-request.api";

const emptyForm: PlanRequestFormValues = {
  organization_id: "",
  plan_id: "",
  company_name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  requested_plan_name: "",
  billing_cycle: "monthly",
  message: "",
  admin_notes: "",
};

const PlanRequestPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const scope = isSuperAdmin ? "super-admin" : "admin";
  const [items, setItems] = useState<PlanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState<PlanRequest | null>(null);
  const [reviewing, setReviewing] = useState<PlanRequest | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<PlanRequestFormValues>(emptyForm);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPlanRequestsApi(scope)
      .then((data) => active && setItems(data))
      .catch((err: unknown) => active && setError(err instanceof Error ? err.message : "Failed to load plan requests"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [scope]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = { ...form };
      const saved = await createPlanRequestApi(scope, payload);
      setItems((current) => [saved, ...current]);
      setEditing(false);
      setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    await deletePlanRequestApi(scope, deleting.id);
    setItems((current) => current.filter((item) => item.id !== deleting.id));
    setDeleting(null);
  };

  const review = async () => {
    if (!reviewing || !action) return;
    const payload = {
      admin_notes: reviewing.admin_notes ?? "",
      create_order: true,
      plan_id: reviewing.plan_id ?? null,
      organization_id: reviewing.organization_id ?? null,
    };
    const saved = action === "approve"
      ? await approvePlanRequestApi(reviewing.id, payload)
      : await rejectPlanRequestApi(reviewing.id, payload);
    setItems((current) => current.map((item) => (item.id === saved.id ? saved : item)));
    setReviewing(null);
    setAction(null);
  };

  return (
    <Content>
      <PageHeader title="Plan Requests" subtitle="Manage request submissions from companies." />
      <KTCard>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h3 className="fw-bold mb-1">Plan Requests</h3>
              <div className="text-muted">{items.length} requests</div>
            </div>
            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              <KTIcon iconName="plus" className="fs-2 me-2" />
              New Request
            </button>
          </div>
          {loading && <div className="alert alert-light">Loading plan requests...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && items.length === 0 && <div className="alert alert-info">No plan requests found.</div>}
          <div className="table-responsive">
            <table className="table align-middle table-row-dashed">
              <thead>
                <tr className="text-muted fw-semibold">
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="fw-bold">{item.company_name ?? item.organization?.name ?? "-"}</div>
                      <div className="text-muted fs-7">{item.contact_email}</div>
                    </td>
                    <td>{item.requested_plan_name ?? item.plan?.name ?? "-"}</td>
                    <td><span className="badge badge-light-primary">{item.status}</span></td>
                    <td className="text-muted">{item.created_at ?? "-"}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        {isSuperAdmin && item.status === "pending" && (
                          <button className="btn btn-sm btn-light-success" onClick={() => { setReviewing(item); setAction("approve"); }}>
                            Approve
                          </button>
                        )}
                        {isSuperAdmin && item.status === "pending" && (
                          <button className="btn btn-sm btn-light-danger" onClick={() => { setReviewing(item); setAction("reject"); }}>
                            Reject
                          </button>
                        )}
                        <button className="btn btn-sm btn-light-danger" onClick={() => setDeleting(item)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </KTCard>

      {editing && (
        <ModalShell title="New Plan Request" onClose={() => setEditing(false)} onSubmit={submit} isSubmitting={submitting} submitLabel="Create" isValid={true}>
          <div className="fv-row mb-4">
            <label className="form-label">Company Name</label>
            <input className="form-control form-control-solid" value={form.company_name ?? ""} onChange={(e) => setForm((current) => ({ ...current, company_name: e.target.value }))} />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label">Contact Name</label>
            <input className="form-control form-control-solid" value={form.contact_name ?? ""} onChange={(e) => setForm((current) => ({ ...current, contact_name: e.target.value }))} />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label">Contact Email</label>
            <input className="form-control form-control-solid" value={form.contact_email ?? ""} onChange={(e) => setForm((current) => ({ ...current, contact_email: e.target.value }))} />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label">Requested Plan</label>
            <input className="form-control form-control-solid" value={form.requested_plan_name ?? ""} onChange={(e) => setForm((current) => ({ ...current, requested_plan_name: e.target.value }))} />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label">Billing Cycle</label>
            <select className="form-select form-select-solid" value={form.billing_cycle ?? "monthly"} onChange={(e) => setForm((current) => ({ ...current, billing_cycle: e.target.value }))}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {isSuperAdmin && (
            <div className="fv-row mb-4">
              <label className="form-label">Organization ID</label>
              <input className="form-control form-control-solid" value={form.organization_id ?? ""} onChange={(e) => setForm((current) => ({ ...current, organization_id: e.target.value }))} />
            </div>
          )}
        </ModalShell>
      )}

      {reviewing && action && (
        <ModalShell
          title={`${action === "approve" ? "Approve" : "Reject"} Plan Request`}
          onClose={() => { setReviewing(null); setAction(null); }}
          onSubmit={review}
          isSubmitting={submitting}
          submitLabel={action === "approve" ? "Approve" : "Reject"}
          isValid={true}
        >
          <div className="fv-row mb-4">
            <label className="form-label">Admin Notes</label>
            <textarea className="form-control form-control-solid" rows={5} value={reviewing.admin_notes ?? ""} onChange={(e) => setReviewing({ ...reviewing, admin_notes: e.target.value })} />
          </div>
        </ModalShell>
      )}

      {deleting && <DeleteConfirmModal title="Delete Plan Request" message={`Delete request for ${deleting.company_name ?? deleting.requested_plan_name}?`} onClose={() => setDeleting(null)} onConfirm={remove} />}
    </Content>
  );
};

export default PlanRequestPage;
