import { useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { EntityList, type Column, type RowAction } from "../../modules/apps/shared_table/entity-list/EntityList";
import { useServerListing } from "../../modules/apps/shared_table/hooks/useServerListing";
import { listingSummaries } from "../../modules/apps/shared_table/listingSummaries";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import {
  deleteSuperAdminAddonApi,
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
  const [editing, setEditing] = useState<Partial<Addon> | null>(null);

  const summary = listingSummaries.addons;
  const { rows, total, params, handleParamsChange, loading, error, reload } =
    useServerListing<Addon>(summary.endpoint, { sort: "sort_order", direction: "asc" });


  const submit = async () => {
    if (!editing?.name || !editing.slug || !editing.feature_key) return;
    await saveSuperAdminAddonApi(editing, editing.id);
    setEditing(null);
    reload();
  };

  const columns = useMemo<Column<Addon>[]>(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: { row: Addon | { original: Addon } }) => {
          const item = "original" in row ? row.original : row;
          return (
            <div>
              <div className="fw-bold">{item.name}</div>
              {item.description && <div className="text-muted fs-7">{item.description}</div>}
            </div>
          );
        },
      },
      { Header: "Slug", accessor: "slug" },
      { Header: "Feature Key", accessor: "feature_key" },
      {
        Header: "Pricing",
        accessor: "pricing_type",
        Cell: ({ row }: { row: Addon | { original: Addon } }) => {
          const p = "original" in row ? row.original : row;
          if (p.pricing_type === "monthly") return `$${p.monthly_price ?? 0}/mo`;
          if (p.pricing_type === "yearly") return `$${p.yearly_price ?? 0}/yr`;
          if (p.pricing_type === "one_time") return `$${p.one_time_price ?? 0} once`;
          return p.pricing_type;
        },
      },
      {
        Header: "Status",
        accessor: "is_active",
        Cell: ({ value }: { value: unknown }) => (value ? "Active" : "Inactive"),
      },
      { Header: "Order", accessor: "sort_order" },
    ],
    []
  );

  const rowActions: RowAction<Addon>[] = [
    {
      label: "Edit",
      onClick: (addon) => setEditing(addon),
    },
    {
      label: "Toggle Status",
      onClick: async (addon) => {
        await toggleSuperAdminAddonApi(addon.id, !addon.is_active);
        reload();
      },
    },
    {
      label: "Delete",
      className: "text-danger",
      onClick: async (addon) => {
        if (!window.confirm(`Delete ${addon.name}?`)) return;
        await deleteSuperAdminAddonApi(addon.id);
        reload();
      },
    },
  ];

  return (
    <Content>
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {loading && <div className="text-muted mb-2">Loading add-ons...</div>}

      <EntityList
        title="Add-ons"
        subtitle="Manage chargeable feature add-ons"
        entityName="addons"
        profileType="none"
        data={rows}
        total={total}
        listingSummary={summary}
        params={params}
        onParamsChange={handleParamsChange}
        columns={columns}
        filtersConfig={[
          {
            key: "is_active",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ]}
        headerActions={[{ label: "New Add-on", onClick: () => setEditing(emptyAddon) }]}
        rowActions={rowActions}
      />

      {editing && (
        <ModalShell
          title={editing.id ? "Edit Add-on" : "New Add-on"}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          submitLabel="Save"
          isValid={Boolean(editing.name && editing.slug && editing.feature_key)}
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
              <input className="form-control form-control-solid" type="number" value={editing.monthly_price ?? ""} onChange={(e) => setEditing((current) => ({ ...current, monthly_price: e.target.value === "" ? null : Number(e.target.value) }))} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Yearly Price</label>
              <input className="form-control form-control-solid" type="number" value={editing.yearly_price ?? ""} onChange={(e) => setEditing((current) => ({ ...current, yearly_price: e.target.value === "" ? null : Number(e.target.value) }))} />
            </div>
            <div className="col-md-4">
              <label className="form-label">One-time Price</label>
              <input className="form-control form-control-solid" type="number" value={editing.one_time_price ?? ""} onChange={(e) => setEditing((current) => ({ ...current, one_time_price: e.target.value === "" ? null : Number(e.target.value) }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Currency</label>
              <input className="form-control form-control-solid" value={editing.currency ?? "AUD"} onChange={(e) => setEditing((current) => ({ ...current, currency: e.target.value.toUpperCase() }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sort Order</label>
              <input className="form-control form-control-solid" type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing((current) => ({ ...current, sort_order: Number(e.target.value) }))} />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control form-control-solid" rows={3} value={editing.description ?? ""} onChange={(e) => setEditing((current) => ({ ...current, description: e.target.value }))} />
            </div>
          </div>
        </ModalShell>
      )}
    </Content>
  );
}
