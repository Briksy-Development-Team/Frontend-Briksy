import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../services/api/axiosInstance";
import PropertyModal from "../../services/features/properties/component/PropertyModal";
import { createPropertyApi } from "../../services/features/properties/property.api";
import type { PropertyFormValues } from "../../services/features/properties/property.types";

type Project = { id: string; name: string; project_type?: string | null; status: string; location?: string | null; state?: string | null };
type ProjectForm = { name: string; project_type: string; status: string; location: string; state: string; postcode: string; description: string };
const EMPTY_FORM: ProjectForm = { name: "", project_type: "", status: "planning", location: "", state: "", postcode: "", description: "" };

export default function BuilderProjectPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProject, setSavingProject] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<{ data: { data: Project[] } }>("/admin/builder-projects");
      setItems(response.data.data.data ?? []);
    } catch {
      setError("Builder projects could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadProjects(); }, [loadProjects]);

  const updateForm = (key: keyof ProjectForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const saveProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProject(true);
    setError(null);
    setNotice(null);
    try {
      await axiosInstance.post("/admin/builder-projects", form);
      setForm(EMPTY_FORM);
      setShowProjectForm(false);
      setNotice("Project added successfully.");
      await loadProjects();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to add this project.");
    } finally {
      setSavingProject(false);
    }
  };

  const saveProperty = async (values: PropertyFormValues) => {
    setSavingProperty(true);
    setError(null);
    setNotice(null);
    try {
      await createPropertyApi(values);
      setShowPropertyForm(false);
      setNotice("Property added successfully. It will appear in your property listings after review.");
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to add this property.");
    } finally {
      setSavingProperty(false);
    }
  };

  return <>
    <div className="card">
      <div className="card-header flex-wrap gap-3">
        <h3 className="card-title">Builder Projects</h3>
        <div className="card-toolbar flex gap-2">
          {/* <button type="button" className="btn btn-light-primary" onClick={() => { setNotice(null); setShowPropertyForm(true); }}>Add Property</button> */}
          <button type="button" className="btn btn-primary" onClick={() => { setNotice(null); setShowProjectForm((shown) => !shown); }}>Add Project</button>
        </div>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {notice && <div className="alert alert-success">{notice}</div>}

        {showProjectForm && <form className="mb-8 rounded border p-5" onSubmit={saveProject}>
          <h4 className="mb-5">Add a project</h4>
          <div className="row g-4">
            <div className="col-md-6"><label className="form-label required">Project name</label><input className="form-control" required maxLength={150} value={form.name} onChange={(event) => updateForm("name", event.target.value)} /></div>
            <div className="col-md-6"><label className="form-label">Project type</label><input className="form-control" maxLength={80} placeholder="e.g. Townhouse development" value={form.project_type} onChange={(event) => updateForm("project_type", event.target.value)} /></div>
            <div className="col-md-4"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={(event) => updateForm("status", event.target.value)}><option value="planning">Planning</option><option value="in_delivery">In delivery</option><option value="completed">Completed</option></select></div>
            <div className="col-md-4"><label className="form-label">Suburb / location</label><input className="form-control" maxLength={150} value={form.location} onChange={(event) => updateForm("location", event.target.value)} /></div>
            <div className="col-md-2"><label className="form-label">State</label><input className="form-control" maxLength={10} value={form.state} onChange={(event) => updateForm("state", event.target.value)} /></div>
            <div className="col-md-2"><label className="form-label">Postcode</label><input className="form-control" maxLength={10} value={form.postcode} onChange={(event) => updateForm("postcode", event.target.value)} /></div>
            <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={(event) => updateForm("description", event.target.value)} /></div>
          </div>
          <div className="mt-5 flex justify-content-end gap-2"><button type="button" className="btn btn-light" onClick={() => { setShowProjectForm(false); setForm(EMPTY_FORM); }}>Cancel</button><button type="submit" className="btn btn-primary" disabled={savingProject}>{savingProject ? "Saving…" : "Save project"}</button></div>
        </form>}

        {loading ? <div className="py-8 text-center">Loading projects…</div> : <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Project</th><th>Type</th><th>Status</th><th>Location</th></tr></thead><tbody>
          {items.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.project_type || "—"}</td><td>{item.status.replace(/_/g, " ")}</td><td>{[item.location, item.state].filter(Boolean).join(", ") || "—"}</td></tr>)}
          {items.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-muted">No projects yet. Add a project to showcase your developments.</td></tr>}
        </tbody></table></div>}
      </div>
    </div>
    {showPropertyForm && <PropertyModal isSubmitting={savingProperty} onClose={() => setShowPropertyForm(false)} onSubmit={saveProperty} />}
  </>;
}
