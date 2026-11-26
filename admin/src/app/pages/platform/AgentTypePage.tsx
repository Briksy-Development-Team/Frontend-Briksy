import { useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { EntityList, type Column, type RowAction } from "../../modules/apps/shared_table/entity-list/EntityList";
import { useServerListing } from "../../modules/apps/shared_table/hooks/useServerListing";
import { listingSummaries } from "../../modules/apps/shared_table/listingSummaries";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import axiosInstance from "../../services/api/axiosInstance";

type PlanFamily = "property_owner" | "trades_professional" | "buyers_agent" | "builders";
type AgentType = {
  id: string;
  name: string;
  slug: string;
  label?: string;
  display_name?: string | null;
  capability_profile?: string | null;
  plan_family?: PlanFamily | null;
  is_active: boolean;
  sort_order: number;
};

const emptyForm = {
  name: "",
  slug: "",
  display_name: "",
  capability_profile: "",
  plan_family: "buyers_agent" as PlanFamily,
  is_active: true,
  sort_order: 0,
};

const familyLabels: Record<PlanFamily, string> = {
  property_owner: "Real Estate",
  trades_professional: "Traders & Professionals",
  buyers_agent: "Agents",
  builders: "Builder",
};

export default function AgentTypePage() {
  const [editing, setEditing] = useState<AgentType | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const summary = listingSummaries.agentTypes;
  const { rows, total, params, handleParamsChange, loading, error, reload } =
    useServerListing<AgentType>(summary.endpoint, { filters: { module: "Agents" }, sort: "sort_order", direction: "asc" });


  const edit = (type?: AgentType) => {
    setEditing(type ?? null);
    setForm(
      type
        ? {
            name: type.name,
            slug: type.slug,
            display_name: type.display_name ?? type.label ?? "",
            capability_profile: type.capability_profile ?? "",
            plan_family: type.plan_family ?? "buyers_agent",
            is_active: type.is_active,
            sort_order: type.sort_order,
          }
        : emptyForm
    );
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, module: "Agents", sort_order: Number(form.sort_order) || 0 };
      if (editing) await axiosInstance.put(`/super-admin/organization-types/${editing.id}`, payload);
      else await axiosInstance.post("/super-admin/organization-types", payload);
      setOpen(false);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<Column<AgentType>[]>(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: { row: AgentType | { original: AgentType } }) => {
          const item = "original" in row ? row.original : row;
          return <span className="fw-bold">{item.display_name || item.label || item.name}</span>;
        },
      },
      { Header: "Slug", accessor: "slug" },
      {
        Header: "Pricing plans",
        accessor: "plan_family",
        Cell: ({ value }: { value: unknown }) =>
          value && familyLabels[value as PlanFamily] ? familyLabels[value as PlanFamily] : "Not configured",
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

  const rowActions: RowAction<AgentType>[] = [
    {
      label: "Edit",
      onClick: (t) => edit(t),
    },
  ];

  return (
    <Content>
      {error && <div className="alert alert-danger mb-5">{error}</div>}
      {loading && <div className="text-muted mb-2">Loading agent types...</div>}

      <EntityList
        title="Agent Types"
        subtitle="Manage the active categories shown under Agents."
        entityName="agent-types"
        profileType="none"
        data={rows}
        total={total}
        listingSummary={summary}
        params={params}
        onParamsChange={(next) => handleParamsChange({ ...next, filters: { ...next.filters, module: "Agents" } })}
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
        headerActions={[{ label: "Add Agent Type", onClick: () => edit() }]}
        rowActions={rowActions}
      />

      {open && (
        <ModalShell
          title={editing ? "Edit Agent Type" : "Add Agent Type"}
          onClose={() => setOpen(false)}
          onSubmit={save}
          isSubmitting={saving}
          isValid={Boolean(form.name.trim() && form.slug.trim())}
        >
          <div className="mb-5">
            <label className="form-label">Name</label>
            <input className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div className="mb-5">
            <label className="form-label">Slug</label>
            <input className="form-control" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} disabled={Boolean(editing)} />
          </div>
          <div className="mb-5">
            <label className="form-label">Display label</label>
            <input className="form-control" value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} />
          </div>
          <div className="mb-5">
            <label className="form-label">Capability profile</label>
            <input className="form-control" value={form.capability_profile} onChange={(event) => setForm({ ...form, capability_profile: event.target.value })} placeholder="Optional" />
          </div>
          <div className="mb-5">
            <label className="form-label">Pricing plans</label>
            <select className="form-select" value={form.plan_family} onChange={(event) => setForm({ ...form, plan_family: event.target.value as PlanFamily })}>
              <option value="buyers_agent">Agents</option>
              {(Object.keys(familyLabels) as PlanFamily[]).filter((family) => family !== "buyers_agent").map((family) => (
                <option key={family} value={family}>{familyLabels[family]}</option>
              ))}
            </select>
            <div className="form-text">All organizations using this type can only use plans from this pricing group.</div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-5">
              <label className="form-label">Sort order</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} />
            </div>
            <div className="col-md-6 mb-5 d-flex align-items-end">
              <label className="form-check form-switch form-check-custom form-check-solid">
                <input className="form-check-input" type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
                <span className="form-check-label">Visible publicly</span>
              </label>
            </div>
          </div>
        </ModalShell>
      )}
    </Content>
  );
}
