import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import {
  deleteSuperAdminDynamicIdSettingApi,
  fetchSuperAdminDynamicIdSettingsApi,
  saveSuperAdminDynamicIdSettingApi,
} from "../../services/features/billing/billing.api";
import type { DynamicIdSetting } from "../../services/features/billing/billing.types";

const emptySetting: Partial<DynamicIdSetting> = {
  entity_type: "",
  separator: "-",
  include_year: false,
  include_month: false,
  number_padding: 6,
  starting_number: 1,
  current_number: 0,
  reset_frequency: "none",
  is_active: true,
};

export default function DynamicIdSettingsPage() {
  const [items, setItems] = useState<DynamicIdSetting[]>([]);
  const [editing, setEditing] = useState<Partial<DynamicIdSetting> | null>(null);

  const load = async () => setItems(await fetchSuperAdminDynamicIdSettingsApi());
  useEffect(() => {
    void load();
  }, []);

  const submit = async () => {
    if (!editing?.entity_type) return;
    await saveSuperAdminDynamicIdSettingApi({
      ...editing,
      entity_type: editing.entity_type,
    }, editing.id);
    setEditing(null);
    await load();
  };

  return (
    <Content>
      <PageHeader title="Dynamic ID Syntax" subtitle="Configure auto-generated IDs per entity" />
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="fw-semibold">ID rules</div>
          <button className="btn btn-primary" onClick={() => setEditing(emptySetting)}>New Rule</button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle table-row-bordered">
              <thead>
                <tr className="text-muted fs-7 text-uppercase">
                  <th>Entity</th>
                  <th>Preview</th>
                  <th>Format</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">{item.entity_type}</td>
                    <td>{item.sample_preview}</td>
                    <td>{[item.prefix, item.include_year ? "YYYY" : null, item.include_month ? "MM" : null, "####"].filter(Boolean).join(item.separator ?? "-")}</td>
                    <td>{item.is_active ? "Active" : "Inactive"}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-light me-2" onClick={() => setEditing(item)}>Edit</button>
                      <button className="btn btn-sm btn-light-danger" onClick={async () => { await deleteSuperAdminDynamicIdSettingApi(item.id); await load(); }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing ? (
        <ModalShell title={editing.id ? "Edit Rule" : "New Rule"} onClose={() => setEditing(null)} onSubmit={submit} isValid={!!editing.entity_type}>
          <div className="row g-5">
            <div className="col-md-6"><label className="form-label">Entity Type</label><input className="form-control form-control-solid" value={editing.entity_type ?? ""} onChange={(e) => setEditing((current) => ({ ...current, entity_type: e.target.value }))} /></div>
            <div className="col-md-6"><label className="form-label">Prefix</label><input className="form-control form-control-solid" value={editing.prefix ?? ""} onChange={(e) => setEditing((current) => ({ ...current, prefix: e.target.value }))} /></div>
            <div className="col-md-4"><label className="form-label">Separator</label><input className="form-control form-control-solid" value={editing.separator ?? "-"} onChange={(e) => setEditing((current) => ({ ...current, separator: e.target.value }))} /></div>
            <div className="col-md-4"><label className="form-label">Padding</label><input className="form-control form-control-solid" type="number" value={editing.number_padding ?? 6} onChange={(e) => setEditing((current) => ({ ...current, number_padding: Number(e.target.value) }))} /></div>
            <div className="col-md-4"><label className="form-label">Start</label><input className="form-control form-control-solid" type="number" value={editing.starting_number ?? 1} onChange={(e) => setEditing((current) => ({ ...current, starting_number: Number(e.target.value) }))} /></div>
            <div className="col-md-4"><label className="form-label">Reset</label><select className="form-select form-select-solid" value={editing.reset_frequency ?? "none"} onChange={(e) => setEditing((current) => ({ ...current, reset_frequency: e.target.value as DynamicIdSetting["reset_frequency"] }))}><option value="none">None</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div>
            <div className="col-md-4 d-flex align-items-end"><label className="form-check form-check-custom form-check-solid"><input className="form-check-input" type="checkbox" checked={editing.include_year ?? false} onChange={(e) => setEditing((current) => ({ ...current, include_year: e.target.checked }))} /><span className="ms-2">Include Year</span></label></div>
            <div className="col-md-4 d-flex align-items-end"><label className="form-check form-check-custom form-check-solid"><input className="form-check-input" type="checkbox" checked={editing.include_month ?? false} onChange={(e) => setEditing((current) => ({ ...current, include_month: e.target.checked }))} /><span className="ms-2">Include Month</span></label></div>
            <div className="col-md-4 d-flex align-items-end"><label className="form-check form-check-custom form-check-solid"><input className="form-check-input" type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing((current) => ({ ...current, is_active: e.target.checked }))} /><span className="ms-2">Active</span></label></div>
          </div>
        </ModalShell>
      ) : null}
    </Content>
  );
}
