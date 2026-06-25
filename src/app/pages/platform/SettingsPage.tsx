import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard } from "../../../_metronic/helpers";
import { useRoleAccess } from "../../modules/auth";
import type { SettingItem } from "../../services/features/settings/settings.types";
import { NotificationPreferences } from "../../services/features/notifications/NotificationPreferences";
import {
  fetchCompanySettingsApi,
  fetchPlatformSettingsApi,
  updateCompanySettingsApi,
  updatePlatformSettingsApi,
} from "../../services/features/settings/settings.api";

const SettingsPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const [items, setItems] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const loader = isSuperAdmin ? fetchPlatformSettingsApi : fetchCompanySettingsApi;
    loader()
      .then((data) => active && setItems(data))
      .catch((err: unknown) => active && setError(err instanceof Error ? err.message : "Failed to load settings"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  const grouped = useMemo(() => {
    return items.reduce<Record<string, SettingItem[]>>((acc, item) => {
      const group = item.group ?? "general";
      acc[group] = acc[group] ?? [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [items]);

  const updateValue = (key: string, value: string) => {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, value } : item)));
  };

  const save = async () => {
    setSaving(true);
    try {
      const saver = isSuperAdmin ? updatePlatformSettingsApi : updateCompanySettingsApi;
      const updated = await saver(items);
      setItems(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Content>
      <PageHeader title="Settings" subtitle={isSuperAdmin ? "Platform settings" : "Company settings"} />
      <KTCard>
        <div className="card-body">
          {loading && <div className="alert alert-light">Loading settings...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && (
            <>
              {Object.keys(grouped).length === 0 && <div className="alert alert-info">No settings found.</div>}
              <div className="row g-5">
                {Object.entries(grouped).map(([group, groupItems]) => (
                  <div className="col-12 col-xl-6" key={group}>
                    <div className="card h-100 border">
                      <div className="card-body">
                        <h4 className="fw-bold mb-4 text-capitalize">{group}</h4>
                        <div className="d-flex flex-column gap-4">
                          {groupItems.map((item) => (
                            <div key={item.key}>
                              <label className="form-label">{item.label ?? item.key}</label>
                              {item.type === "boolean" ? (
                                <select className="form-select form-select-solid" value={item.value} onChange={(e) => updateValue(item.key, e.target.value)}>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                              ) : (
                                <input className="form-control form-control-solid" value={item.value ?? ""} onChange={(e) => updateValue(item.key, e.target.value)} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end mt-5">
                <button className="btn btn-primary" onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </>
          )}
        </div>
      </KTCard>

      <div className="mt-5">
        <NotificationPreferences />
      </div>
    </Content>
  );
};

export default SettingsPage;
