import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import {
  deleteSuperAdminAddonApi,
  fetchSuperAdminAddonsApi,
  saveSuperAdminAddonApi,
  toggleSuperAdminAddonApi,
} from "../../services/features/billing/billing.api";
import type { Addon } from "../../services/features/billing/billing.types";

const emptyAddon: Partial<Addon> = {
  name: "",
  slug: "",
  feature_key: "",
  pricing_type: "monthly",
  currency: "AUD",
  is_active: true,
  sort_order: 0,
};

export default function AddonsPage() {
  const [items, setItems] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Addon> | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchSuperAdminAddonsApi());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load add-ons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async () => {
    if (!editing?.name || !editing.slug || !editing.feature_key) return;
    await saveSuperAdminAddonApi(editing, editing.id);
    setEditing(null);
    await load();
  };

  return (
    <Content>
      <PageHeader title="Add-ons" subtitle="Manage chargeable feature add-ons" />
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="fw-semibold">Active add-ons</div>
          <button className="btn btn-primary" onClick={() => setEditing(emptyAddon)}>New Add-on</button>
        </div>
        <div className="card-body">
          {loading ? <div className="text-muted">Loading...</div> : null}
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="table-responsive">
            <table className="table align-middle table-row-bordered">
              <thead>
                <tr className="text-muted fs-7 text-uppercase">
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Feature</th>
                  <th>Pricing</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((addon) => (
                  <tr key={addon.id}>
                    <td className="fw-semibold">{addon.name}</td>
                    <td>{addon.slug}</td>
                    <td>{addon.feature_key}</td>
                    <td>{addon.pricing_type}</td>
                    <td>{addon.is_active ? "Active" : "Inactive"}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-light me-2" onClick={() => setEditing(addon)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-light me-2"
                        onClick={async () => {
                          await toggleSuperAdminAddonApi(addon.id, !addon.is_active);
                          await load();
                        }}
                      >
                        Toggle
                      </button>
                      <button
                        className="btn btn-sm btn-light-danger"
                        onClick={async () => {
                          await deleteSuperAdminAddonApi(addon.id);
                          await load();
                        }}
                      >
                        Delete
                      </button>
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
          title={editing.id ? "Edit Add-on" : "New Add-on"}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          submitLabel="Save"
          isValid={!!editing.name && !!editing.slug && !!editing.feature_key}
        >
          <div className="row g-5">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control form-control-solid" value={editing.name ?? ""} onChange={(e) => setEditing((current) => ({ ...current, name: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input className="form-control form-control-solid" value={editing.slug ?? ""} onChange={(e) => setEditing((current) => ({ ...current, slug: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Feature Key</label>
              <input className="form-control form-control-solid" value={editing.feature_key ?? ""} onChange={(e) => setEditing((current) => ({ ...current, feature_key: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Pricing Type</label>
              <select className="form-select form-select-solid" value={editing.pricing_type ?? "monthly"} onChange={(e) => setEditing((current) => ({ ...current, pricing_type: e.target.value as Addon["pricing_type"] }))}>
                <option value="one_time">One Time</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="usage_based">Usage Based</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Monthly Price</label>
              <input className="form-control form-control-solid" type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }} value={editing.monthly_price ?? ""} onChange={(e) => setEditing((current) => ({ ...current, monthly_price: e.target.value === "" ? null : Number(e.target.value) }))} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Yearly Price</label>
              <input className="form-control form-control-solid" type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }} value={editing.yearly_price ?? ""} onChange={(e) => setEditing((current) => ({ ...current, yearly_price: e.target.value === "" ? null : Number(e.target.value) }))} />
            </div>
            <div className="col-md-4">
              <label className="form-label">One-time Price</label>
              <input className="form-control form-control-solid" type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }} value={editing.one_time_price ?? ""} onChange={(e) => setEditing((current) => ({ ...current, one_time_price: e.target.value === "" ? null : Number(e.target.value) }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Currency</label>
              <input className="form-control form-control-solid" value={editing.currency ?? "AUD"} onChange={(e) => setEditing((current) => ({ ...current, currency: e.target.value.toUpperCase() }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sort Order</label>
              <input className="form-control form-control-solid" type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }} value={editing.sort_order ?? 0} onChange={(e) => setEditing((current) => ({ ...current, sort_order: Number(e.target.value) }))} />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control form-control-solid" rows={3} value={editing.description ?? ""} onChange={(e) => setEditing((current) => ({ ...current, description: e.target.value }))} />
            </div>
          </div>
        </ModalShell>
      ) : null}
    </Content>
  );
}
