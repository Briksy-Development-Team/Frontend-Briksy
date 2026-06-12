import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard, KTIcon } from "../../../_metronic/helpers";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { useRoleAccess } from "../../modules/auth";
import type { Order, OrderFormValues } from "../../services/features/orders/order.types";
import {
  cancelOrderApi,
  createOrderApi,
  deleteOrderApi,
  fetchOrdersApi,
  markOrderPaidApi,
  updateOrderApi,
} from "../../services/features/orders/order.api";

const emptyForm: OrderFormValues = {
  subtotal: 0,
  discount_amount: 0,
  tax_amount: 0,
  total_amount: 0,
  currency: "INR",
  payment_status: "pending",
  order_status: "draft",
};

const OrderPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const scope = isSuperAdmin ? "super-admin" : "admin";
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<OrderFormValues>(emptyForm);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOrdersApi(scope)
      .then((data) => active && setItems(data))
      .catch((err: unknown) => active && setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [scope]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const saved = editing
        ? await updateOrderApi(scope, editing.id, form)
        : await createOrderApi(scope, form);
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
    await deleteOrderApi(scope, deleting.id);
    setItems((current) => current.filter((item) => item.id !== deleting.id));
    setDeleting(null);
  };

  const markPaid = async (id: string) => {
    const saved = await markOrderPaidApi(id);
    setItems((current) => current.map((order) => (order.id === id ? saved : order)));
  };

  const cancel = async (id: string) => {
    const saved = await cancelOrderApi(scope, id);
    setItems((current) => current.map((order) => (order.id === id ? saved : order)));
  };

  return (
    <Content>
      <PageHeader title="Orders" subtitle="Track plan and billing orders." />
      <KTCard>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h3 className="fw-bold mb-1">Orders</h3>
              <div className="text-muted">{items.length} orders</div>
            </div>
            <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(emptyForm); setIsModalOpen(true); }}>
              <KTIcon iconName="plus" className="fs-2 me-2" />
              New Order
            </button>
          </div>
          {loading && <div className="alert alert-light">Loading orders...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && items.length === 0 && <div className="alert alert-info">No orders found.</div>}
          <div className="table-responsive">
            <table className="table align-middle table-row-dashed">
              <thead>
                <tr className="text-muted fw-semibold">
                  <th>Order</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Company</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold">{item.order_number}</td>
                    <td>{item.payment_status} / {item.order_status}</td>
                    <td>{item.currency} {item.total_amount}</td>
                    <td>{item.organization?.name ?? item.organization_id ?? "-"}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm btn-light" onClick={() => { setEditing(item); setForm({
                          organization_id: item.organization_id ?? null,
                          user_id: item.user_id ?? null,
                          plan_id: item.plan_id ?? null,
                          coupon_id: item.coupon_id ?? null,
                          subtotal: Number(item.subtotal),
                          discount_amount: Number(item.discount_amount),
                          tax_amount: Number(item.tax_amount),
                          total_amount: Number(item.total_amount),
                          currency: item.currency,
                          billing_cycle: item.billing_cycle ?? null,
                          payment_status: item.payment_status,
                          order_status: item.order_status,
                          payment_method: item.payment_method ?? null,
                          transaction_reference: item.transaction_reference ?? null,
                          starts_at: item.starts_at ?? null,
                          ends_at: item.ends_at ?? null,
                          notes: item.notes ?? null,
                        }); setIsModalOpen(true); }}>Edit</button>
                        {isSuperAdmin && <button className="btn btn-sm btn-light-success" onClick={() => markPaid(item.id)}>Mark Paid</button>}
                        <button className="btn btn-sm btn-light-warning" onClick={() => cancel(item.id)}>Cancel</button>
                        {isSuperAdmin && <button className="btn btn-sm btn-light-danger" onClick={() => setDeleting(item)}>Delete</button>}
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
        <ModalShell title={editing ? "Edit Order" : "Create Order"} onClose={() => { setEditing(null); setForm(emptyForm); setIsModalOpen(false); }} onSubmit={submit} isSubmitting={submitting} submitLabel={editing ? "Update" : "Create"} isValid={true}>
          <div className="fv-row mb-3">
            <label className="form-label required">Subtotal</label>
            <input type="number" className="form-control form-control-solid" value={form.subtotal} onChange={(e) => setForm((current) => ({ ...current, subtotal: Number(e.target.value) }))} />
          </div>
          <div className="fv-row mb-3">
            <label className="form-label">Coupon Code</label>
            <input className="form-control form-control-solid" value={form.coupon_code ?? ""} onChange={(e) => setForm((current) => ({ ...current, coupon_code: e.target.value }))} />
          </div>
          {isSuperAdmin && (
            <div className="fv-row mb-3">
              <label className="form-label">Organization ID</label>
              <input className="form-control form-control-solid" value={form.organization_id ?? ""} onChange={(e) => setForm((current) => ({ ...current, organization_id: e.target.value }))} />
            </div>
          )}
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label">Payment Status</label>
              <select className="form-select form-select-solid" value={form.payment_status ?? "pending"} onChange={(e) => setForm((current) => ({ ...current, payment_status: e.target.value as OrderFormValues["payment_status"] }))}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label">Order Status</label>
              <select className="form-select form-select-solid" value={form.order_status ?? "draft"} onChange={(e) => setForm((current) => ({ ...current, order_status: e.target.value as OrderFormValues["order_status"] }))}>
                <option value="draft">Draft</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </ModalShell>
      )}

      {deleting && <DeleteConfirmModal title="Delete Order" message={`Delete ${deleting.order_number}?`} onClose={() => setDeleting(null)} onConfirm={remove} />}
    </Content>
  );
};

export default OrderPage;
