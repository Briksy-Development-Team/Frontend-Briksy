import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard } from "../../../_metronic/helpers";
import { useRoleAccess } from "../../modules/auth";
import type { SettingItem } from "../../services/features/settings/settings.types";
import type { Organization } from "../../services/features/organization/organization.types";
import { NotificationPreferences } from "../../services/features/notifications/NotificationPreferences";
import {
  fetchCompanySettingsApi,
  fetchPlatformSettingsApi,
  updateCompanySettingsApi,
  updatePlatformSettingsApi,
} from "../../services/features/settings/settings.api";
import { fetchCurrentOrganizationApi, uploadOrganizationMediaApi } from "../../services/features/organization/organization.api";

const SettingsPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const [items, setItems] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaMessage, setMediaMessage] = useState<string | null>(null);
  const [mediaInputKey, setMediaInputKey] = useState(0);

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

  useEffect(() => {
    if (isSuperAdmin) {
      setOrganization(null);
      return;
    }

    let active = true;
    void fetchCurrentOrganizationApi()
      .then((data) => {
        if (active) setOrganization(data);
      })
      .catch(() => {
        if (active) setOrganization(null);
      });

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

  const uploadMedia = async () => {
    if (!organization || (!profileImage && !bannerImage)) return;

    setMediaLoading(true);
    setMediaMessage(null);
    try {
      const updated = await uploadOrganizationMediaApi(organization.id, {
        profile_image: profileImage ?? undefined,
        banner_image: bannerImage ?? undefined,
      });
      setOrganization(updated);
      setProfileImage(null);
      setBannerImage(null);
      setMediaInputKey((key) => key + 1);
      setMediaMessage("Images uploaded successfully.");
    } catch (err: unknown) {
      setMediaMessage(err instanceof Error ? err.message : "Failed to upload images.");
    } finally {
      setMediaLoading(false);
    }
  };

  const renderProfileMediaUpload = (group: string) => {
    if (isSuperAdmin || group.toLowerCase() !== "profile") return null;

    return (
      <div className="border-top pt-5 mt-1">
        <div className="row g-5">
          <div className="col-12 col-lg-5">
            <label className="form-label fw-semibold">Profile picture</label>
            <div className="d-flex align-items-center gap-4">
              <div className="symbol symbol-80px symbol-circle bg-light">
                {organization?.logo_url ? (
                  <img src={organization.logo_url} alt="Company profile" className="object-fit-cover" />
                ) : (
                  <span className="text-muted fw-semibold">Logo</span>
                )}
              </div>
              <input
                key={`profile-${mediaInputKey}`}
                className="form-control form-control-solid"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <label className="form-label fw-semibold">Banner picture</label>
            <div className="d-flex flex-column gap-3">
              <div className="rounded border bg-light overflow-hidden" style={{ height: 96 }}>
                {organization?.banner_url ? (
                  <img src={organization.banner_url} alt="Company banner" className="w-100 h-100 object-fit-cover" />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted fw-semibold">Banner preview</div>
                )}
              </div>
              <input
                key={`banner-${mediaInputKey}`}
                className="form-control form-control-solid"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setBannerImage(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-3 mt-5">
          {mediaMessage ? <div className="text-muted fs-7">{mediaMessage}</div> : <div />}
          <button
            type="button"
            className="btn btn-primary"
            onClick={uploadMedia}
            disabled={mediaLoading || !organization || (!profileImage && !bannerImage)}
          >
            {mediaLoading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </div>
    );
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
                          {renderProfileMediaUpload(group)}
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
