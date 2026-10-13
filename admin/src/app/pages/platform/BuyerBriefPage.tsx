import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard } from "../../../_metronic/helpers";
import { useAuth } from "../../modules/auth";
import type { Organization } from "../../services/features/organization/organization.types";
import {
  fetchCurrentOrganizationApi,
  updateOrganizationApi,
  uploadOrganizationMediaApi,
} from "../../services/features/organization/organization.api";
import { fetchAdminDashboardSummary, type AdminDashboardSummary } from "../../services/features/dashboard/dashboard.api";
import BuyerBriefListPage from "./BuyerBriefListPage";

const emptyProfile = {
  name: "", contact_email: "", contact_phone: "", address: "", description: "", website: "",
  service_areas: "", instagram: "", facebook: "", linkedin: "", intro_video_url: "", reel_urls: "",
};

const BuyerAgentProfilePage = () => {
  const { entitlements } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [form, setForm] = useState(emptyProfile);
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchCurrentOrganizationApi(), fetchAdminDashboardSummary()])
      .then(([profile, dashboard]) => {
        setOrganization(profile);
        setSummary(dashboard);
        setForm({
          name: profile?.name ?? "",
          contact_email: profile?.contact_email ?? "",
          contact_phone: profile?.contact_phone ?? "",
          address: profile?.address ?? "",
          description: profile?.description ?? "",
          website: profile?.website ?? "",
          service_areas: (profile?.service_areas ?? []).join(", "),
          instagram: profile?.social_links?.instagram ?? "",
          facebook: profile?.social_links?.facebook ?? "",
          linkedin: profile?.social_links?.linkedin ?? "",
          intro_video_url: profile?.intro_video_url ?? "",
          reel_urls: (profile?.reel_urls ?? []).join("\n"),
        });
      })
      .catch(() => setError("Your Buyers Agent profile could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof typeof emptyProfile, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const serviceAreaLimit = entitlements?.limits?.service_areas ?? null;
  const mediaEnabled = entitlements?.features?.business_profile?.enabled ?? false;
  const introVideoEnabled = (entitlements?.limits?.videos ?? 0) > 0;
  const reelLimit = entitlements?.limits?.reels ?? 0;

  const save = async () => {
    if (!organization || !form.name.trim()) return;
    setSaving(true); setMessage(null); setError(null);
    try {
      const updated = await updateOrganizationApi(organization.id, {
        name: form.name.trim(), contact_email: form.contact_email || undefined, contact_phone: form.contact_phone || undefined,
        address: form.address || undefined, description: form.description || undefined, website: form.website || undefined,
        service_areas: form.service_areas.split(",").map((item) => item.trim()).filter(Boolean).slice(0, serviceAreaLimit ?? 50),
        social_links: { instagram: form.instagram, facebook: form.facebook, linkedin: form.linkedin },
        intro_video_url: form.intro_video_url || undefined,
        reel_urls: form.reel_urls.split("\n").map((item) => item.trim()).filter(Boolean).slice(0, reelLimit),
      });
      let profile = updated;
      if (logo || banner) profile = await uploadOrganizationMediaApi(organization.id, { profile_image: logo ?? undefined, banner_image: banner ?? undefined });
      setOrganization(profile); setLogo(null); setBanner(null); setMessage("Buyers Agent profile saved successfully.");
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "The profile could not be saved.");
    } finally { setSaving(false); }
  };

  const field = (key: keyof typeof emptyProfile, label: string, type = "text") => (
    <div className="fv-row mb-5"><label className="form-label">{label}</label><input type={type} className="form-control form-control-solid" value={form[key]} onChange={(event) => update(key, event.target.value)} /></div>
  );

  if (loading) return <Content><PageHeader title="Buyers Agent Profile" subtitle="Manage how your agency appears on Briksy" /><div className="alert alert-light">Loading profile...</div></Content>;

  return <Content>
    <PageHeader title="Buyers Agent Profile" subtitle="Manage your agency profile, coverage, media, and performance" />
    {error && <div className="alert alert-danger">{error}</div>}{message && <div className="alert alert-success">{message}</div>}
    <KTCard>
      <div className="card-body">
        <h3 className="fw-bold mb-6">About your agency</h3>
        <div className="row"><div className="col-md-6">{field("name", "Agency name")}</div><div className="col-md-6">{field("website", "Website", "url")}</div><div className="col-md-6">{field("contact_email", "Email", "email")}</div><div className="col-md-6">{field("contact_phone", "Phone", "tel")}</div></div>
        <div className="fv-row mb-5"><label className="form-label">Agency description <span className="text-muted">(max 1,500 characters)</span></label><textarea className="form-control form-control-solid" rows={5} maxLength={1500} value={form.description} onChange={(event) => update("description", event.target.value)} /></div>
        {field("address", "Office location")}

        <h3 className="fw-bold mb-6 mt-8">Service areas</h3>
        {field("service_areas", `Suburbs covered${serviceAreaLimit ? ` (up to ${serviceAreaLimit})` : ""}`)}
        <div className="form-text mb-6">Separate suburbs with commas. Your plan determines the maximum coverage.</div>

        <h3 className="fw-bold mb-6 mt-8">Social links</h3>
        <div className="row"><div className="col-md-4">{field("instagram", "Instagram", "url")}</div><div className="col-md-4">{field("facebook", "Facebook", "url")}</div><div className="col-md-4">{field("linkedin", "LinkedIn", "url")}</div></div>

        <h3 className="fw-bold mb-6 mt-8">Media</h3>
        <div className="alert alert-light-info">Your plan controls which profile media is publicly available. Images are uploaded here; video and reel links are optional.</div>
        <div className="row"><div className="col-md-6 fv-row mb-5"><label className="form-label">Agency logo</label><input className="form-control form-control-solid" type="file" accept="image/jpeg,image/png,image/webp" disabled={!mediaEnabled} onChange={(event) => setLogo(event.target.files?.[0] ?? null)} /></div><div className="col-md-6 fv-row mb-5"><label className="form-label">Cover image</label><input className="form-control form-control-solid" type="file" accept="image/jpeg,image/png,image/webp" disabled={!mediaEnabled} onChange={(event) => setBanner(event.target.files?.[0] ?? null)} /></div></div>
        <div className="fv-row mb-5"><label className="form-label">Intro video URL</label><input type="url" className="form-control form-control-solid" disabled={!introVideoEnabled} value={form.intro_video_url} onChange={(event) => update("intro_video_url", event.target.value)} /></div>
        <div className="fv-row mb-5"><label className="form-label">Reel URLs <span className="text-muted">(one per line, max {reelLimit})</span></label><textarea className="form-control form-control-solid" rows={3} disabled={!reelLimit} value={form.reel_urls} onChange={(event) => update("reel_urls", event.target.value)} /></div>

        <h3 className="fw-bold mb-6 mt-8">Performance stats</h3>
        <div className="row g-4">{[["Leads", summary?.metrics.inquiries ?? 0], ["New leads", summary?.metrics.new_inquiries ?? 0], ["Team members", summary?.metrics.team_members ?? 0], ["Lead conversion", `${summary?.lead_conversion_rate ?? 0}%`]].map(([label, value]) => <div className="col-6 col-lg-3" key={String(label)}><div className="border rounded p-4"><div className="text-muted fs-7">{label}</div><div className="fs-2 fw-bold">{value}</div></div></div>)}</div>
        <div className="d-flex justify-content-end mt-8"><button type="button" className="btn btn-primary" disabled={saving || !form.name.trim()} onClick={() => void save()}>{saving ? "Saving..." : "Save profile"}</button></div>
      </div>
    </KTCard>
  </Content>;
};

const BuyerBriefPage = () => (
  <Routes>
    <Route index element={<BuyerBriefListPage />} />
    <Route path="profile" element={<BuyerAgentProfilePage />} />
    <Route path=":id" element={<BuyerBriefListPage />} />
  </Routes>
);

export default BuyerBriefPage;
