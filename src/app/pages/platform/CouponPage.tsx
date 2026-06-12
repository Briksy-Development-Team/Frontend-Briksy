import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard, KTIcon } from "../../../_metronic/helpers";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { useRoleAccess } from "../../modules/auth";
import type { Coupon, CouponFormValues } from "../../services/features/coupons/coupon.types";
import {
  activateCouponApi,
  createCouponApi,
  deactivateCouponApi,
  deleteCouponApi,
  fetchCouponsApi,
  validateCouponApi,
  updateCouponApi,
} from "../../services/features/coupons/coupon.api";

const emptyForm: CouponFormValues = {
  code: "",
  name: "",
  discount_type: "percentage",
  discount_value: 10,
  description: "",
  status: "active",
};

const CouponPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const scope = isSuperAdmin ? "super-admin" : "admin";
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationCode, setValidationCode] = useState("WELCOME10");
  const [validationAmount, setValidationAmount] = useState(1200);
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [form, setForm] = useState<CouponFormValues>(emptyForm);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCouponsApi(scope)
      .then((data) => active && setItems(data))
      .catch((err: unknown) => active && setError(err instanceof Error ? err.message : "Failed to load coupons"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [scope]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const saved = editing
        ? await updateCouponApi(scope, editing.id, form)
        : await createCouponApi(scope, form);
      setItems((current) => {
        const idx = current.findIndex((item) => item.id === saved.id);
        if (idx === -1) return [saved, ...current];
        const next = [...current];
        next[idx] = saved;
        return next;
      });
      setEditing(null);
      setIsModalOpen(false);
      setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    await deleteCouponApi(scope, deleting.id);
    setItems((current) => current.filter((item) => item.id !== deleting.id));
    setDeleting(null);
  };

  const toggleCouponStatus = async (id: string, action: "activate" | "deactivate") => {
    const saved = action === "activate" ? await activateCouponApi(id) : await deactivateCouponApi(id);
    setItems((current) => current.map((coupon) => (coupon.id === id ? saved : coupon)));
  };

  const validate = async () => {
    try {
      const result = await validateCouponApi(scope, { code: validationCode, amount: validationAmount });
      setValidationResult(`Valid. Discount: ${result.discount_amount ?? 0}`);
    } catch (error) {
      setValidationResult(error instanceof Error ? error.message : "Coupon validation failed");
    }
  };

  return (
    <Content>
      <PageHeader title="Coupons" subtitle="Create, validate, and manage discount coupons." />
      <KTCard>
        <div className="card-body">
          <div className="row g-5 mb-6">
            <div className="col-md-6">
              <div className="card h-100 border">
                <div className="card-body">
                  <h4 className="fw-bold mb-3">Validate Coupon</h4>
                  <div className="d-flex gap-2 mb-3">
                    <input className="form-control form-control-solid" value={validationCode} onChange={(e) => setValidationCode(e.target.value)} />
                    <input className="form-control form-control-solid" type="number" value={validationAmount} onChange={(e) => setValidationAmount(Number(e.target.value))} />
                  </div>
                  <button className="btn btn-primary" onClick={validate}>Validate</button>
                  {validationResult && <div className="alert alert-info mt-3 mb-0">{validationResult}</div>}
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-stretch">
              <div className="card h-100 border w-100">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-bold mb-1">Coupon List</h4>
                    <div className="text-muted">{items.length} coupons</div>
                  </div>
                    <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(emptyForm); setIsModalOpen(true); }}>
                      <KTIcon iconName="plus" className="fs-2 me-2" />
                      Add Coupon
                    </button>
                </div>
              </div>
            </div>
          </div>
          {loading && <div className="alert alert-light">Loading coupons...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && items.length === 0 && <div className="alert alert-info">No coupons found.</div>}
          <div className="table-responsive">
            <table className="table align-middle table-row-dashed">
              <thead>
                <tr className="text-muted fw-semibold">
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Usage</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold">{item.code}</td>
                    <td>{item.discount_type} {item.discount_value}</td>
                    <td><span className="badge badge-light-primary">{item.status}</span></td>
                    <td>{item.usage_count ?? 0}/{item.usage_limit ?? "∞"}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        {isSuperAdmin && (
                          <>
                            <button className="btn btn-sm btn-light" onClick={() => { setEditing(item); setForm({
                              code: item.code,
                              name: item.name,
                              description: item.description ?? "",
                              discount_type: item.discount_type,
                              discount_value: Number(item.discount_value),
                              max_discount_amount: item.max_discount_amount ? Number(item.max_discount_amount) : null,
                              min_order_amount: item.min_order_amount ? Number(item.min_order_amount) : null,
                              starts_at: item.starts_at ?? null,
                              expires_at: item.expires_at ?? null,
                              usage_limit: item.usage_limit ?? null,
                              per_user_limit: item.per_user_limit ?? null,
                              status: item.status,
                            }); setIsModalOpen(true); }}>Edit</button>
                            <button className="btn btn-sm btn-light-success" onClick={() => toggleCouponStatus(item.id, "activate")}>Activate</button>
                            <button className="btn btn-sm btn-light-warning" onClick={() => toggleCouponStatus(item.id, "deactivate")}>Deactivate</button>
                            <button className="btn btn-sm btn-light-danger" onClick={() => setDeleting(item)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </KTCard>

      {isModalOpen && (
        <ModalShell title={editing ? "Edit Coupon" : "Add Coupon"} onClose={() => { setEditing(null); setForm(emptyForm); setIsModalOpen(false); }} onSubmit={submit} isSubmitting={submitting} submitLabel={editing ? "Update" : "Create"} isValid={form.code.trim().length > 0 && form.name.trim().length > 0}>
          <div className="fv-row mb-3">
            <label className="form-label required">Code</label>
            <input className="form-control form-control-solid" value={form.code} onChange={(e) => setForm((current) => ({ ...current, code: e.target.value }))} />
          </div>
          <div className="fv-row mb-3">
            <label className="form-label required">Name</label>
            <input className="form-control form-control-solid" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
          </div>
          <div className="fv-row mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control form-control-solid" value={form.description ?? ""} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
          </div>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label">Type</label>
              <select className="form-select form-select-solid" value={form.discount_type} onChange={(e) => setForm((current) => ({ ...current, discount_type: e.target.value as CouponFormValues["discount_type"] }))}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label">Discount</label>
              <input type="number" className="form-control form-control-solid" value={form.discount_value} onChange={(e) => setForm((current) => ({ ...current, discount_value: Number(e.target.value) }))} />
            </div>
          </div>
        </ModalShell>
      )}

      {deleting && <DeleteConfirmModal title="Delete Coupon" message={`Delete ${deleting.code}?`} onClose={() => setDeleting(null)} onConfirm={remove} />}
    </Content>
  );
};

export default CouponPage;
