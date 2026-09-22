import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/api/axiosInstance";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import PropertyModal from "../../services/features/properties/component/PropertyModal";
import { createPropertyApi } from "../../services/features/properties/property.api";
import type { PropertyFormValues } from "../../services/features/properties/property.types";
import { builderProjectConfig } from "../../services/features/builder_projects/builder_project.config";
import type { BuilderProject } from "../../services/features/builder_projects/builder_project.types";
import {
  BuilderProjectModal,
  type ProjectFormValues,
} from "../../services/features/builder_projects/component/BuilderProjectModal";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";

type Project = { id: string; name: string; project_type?: string | null; status: string; location?: string | null; state?: string | null };
type ProjectForm = { name: string; project_type: string; status: string; location: string; state: string; postcode: string; description: string; features: string[] };
const EMPTY_FORM: ProjectForm = { name: "", project_type: "", status: "planning", location: "", state: "", postcode: "", description: "", features: [] };

export default function BuilderProjectPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [savingProject, setSavingProject] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [featureInput, setFeatureInput] = useState("");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const fetchProjects = useCallback(async (params?: any) => {
    setError(null);
    try {
      const response = await axiosInstance.get<{ data: { data: BuilderProject[]; total?: number } }>(
        "/admin/builder-projects",
        { params }
      );
      const items = response.data.data.data ?? [];
      setData(items);
      setTotal(response.data.data.total ?? items.length);
    } catch {
      setError("Builder projects could not be loaded.");
    }
  }, []);

  const { params, handleParamsChange } = useEntityTable(fetchProjects);

  useEffect(() => {
    void fetchProjects(params);
  }, [fetchProjects, params]);

  const addFeature = () => {
    const feature = featureInput.trim();
    if (!feature) return;
    setForm((current) => current.features.some((item) => item.toLowerCase() === feature.toLowerCase()) || current.features.length >= 30
      ? current
      : { ...current, features: [...current.features, feature] });
    setFeatureInput("");
  };

  const formatDescription = (before: string, after = before) => {
    const editor = descriptionRef.current;
    if (!editor) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = form.description.slice(start, end) || "text";
    const updated = `${form.description.slice(0, start)}${before}${selected}${after}${form.description.slice(end)}`;
    setForm((current) => ({ ...current, description: updated }));
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const saveProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProject(true);
    setError(null);
    setNotice(null);
    try {
      await axiosInstance.post("/admin/builder-projects", values);
      setShowProjectModal(false);
      setNotice("Project added successfully.");
      await fetchProjects(params);
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
      setShowPropertyModal(false);
      setNotice("Property added successfully. It will appear in your property listings after review.");
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to add this property.");
    } finally {
      setSavingProperty(false);
    }
  };

  return (
    <Content>
      <PageHeader
        title="Builder Projects"
        subtitle="Manage and view residential and commercial developments"
      />

        {showProjectForm && <form className="mb-8 rounded border p-5" onSubmit={saveProject}>
          <h4 className="mb-5">Add a project</h4>
          <div className="row g-4">
            <div className="col-md-6"><label className="form-label required">Project name</label><input className="form-control" required maxLength={150} value={form.name} onChange={(event) => updateForm("name", event.target.value)} /></div>
            <div className="col-md-6"><label className="form-label">Project type</label><input className="form-control" maxLength={80} placeholder="e.g. Townhouse development" value={form.project_type} onChange={(event) => updateForm("project_type", event.target.value)} /></div>
            <div className="col-md-4"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={(event) => updateForm("status", event.target.value)}><option value="planning">Planning</option><option value="in_delivery">In delivery</option><option value="completed">Completed</option></select></div>
            <div className="col-md-4"><label className="form-label">Suburb / location</label><input className="form-control" maxLength={150} value={form.location} onChange={(event) => updateForm("location", event.target.value)} /></div>
            <div className="col-md-2"><label className="form-label">State</label><input className="form-control" maxLength={10} value={form.state} onChange={(event) => updateForm("state", event.target.value)} /></div>
            <div className="col-md-2"><label className="form-label">Postcode</label><input className="form-control" maxLength={10} value={form.postcode} onChange={(event) => updateForm("postcode", event.target.value)} /></div>
            <div className="col-12">
              <label className="form-label">Project features</label>
              <div className="d-flex gap-2"><input className="form-control" maxLength={80} placeholder="e.g. Solar panels" value={featureInput} onChange={(event) => setFeatureInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addFeature(); } }} /><button type="button" className="btn btn-light-primary" onClick={addFeature} disabled={!featureInput.trim() || form.features.length >= 30}>Add feature</button></div>
              {form.features.length > 0 && <div className="mt-3 d-flex flex-wrap gap-2">{form.features.map((feature) => <span key={feature} className="badge badge-light d-inline-flex align-items-center gap-2 py-2 px-3">{feature}<button type="button" className="btn btn-sm p-0 text-danger" aria-label={`Remove ${feature}`} onClick={() => setForm((current) => ({ ...current, features: current.features.filter((item) => item !== feature) }))}>×</button></span>)}</div>}
              <div className="form-text">Add up to 30 highlights, such as home designs, amenities, or sustainability features.</div>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <div className="d-flex gap-2 mb-2" role="toolbar" aria-label="Description formatting">
                <button type="button" className="btn btn-sm btn-light" onClick={() => formatDescription("**") }><strong>B</strong></button>
                <button type="button" className="btn btn-sm btn-light" onClick={() => formatDescription("*")}><em>I</em></button>
                <button type="button" className="btn btn-sm btn-light" onClick={() => formatDescription("## ", "")}>Heading</button>
                <button type="button" className="btn btn-sm btn-light" onClick={() => formatDescription("- ", "")}>• List item</button>
              </div>
              <textarea ref={descriptionRef} className="form-control" rows={6} maxLength={20000} value={form.description} placeholder="Describe this project. Select words and use the toolbar to style them." onChange={(event) => updateForm("description", event.target.value)} />
              <div className="form-text">Select text, then use bold or italic. Heading and list buttons insert formatted lines.</div>
            </div>
          </div>
          <div className="mt-5 flex justify-content-end gap-2"><button type="button" className="btn btn-light" onClick={() => { setShowProjectForm(false); setForm(EMPTY_FORM); }}>Cancel</button><button type="submit" className="btn btn-primary" disabled={savingProject}>{savingProject ? "Saving…" : "Save project"}</button></div>
        </form>}

      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={builderProjectConfig.columns}
        filtersConfig={builderProjectConfig.filters}
        enableRowClick
        getRowLink={(row) => `/admin/builder-projects/${row.id}`}
        storageKey="builderProjectsColumns"
        headerActions={[
          {
            label: "Add Property",
            onClick: () => {
              setNotice(null);
              setShowPropertyModal(true);
            },
          },
          {
            label: "Add Project",
            onClick: () => {
              setNotice(null);
              setShowProjectModal(true);
            },
          },
        ]}
      />

      {showProjectModal && (
        <BuilderProjectModal
          isSubmitting={savingProject}
          onClose={() => setShowProjectModal(false)}
          onSubmit={saveProject}
        />
      )}

      {showPropertyModal && (
        <PropertyModal
          isSubmitting={savingProperty}
          onClose={() => setShowPropertyModal(false)}
          onSubmit={saveProperty}
        />
      )}
    </Content>
  );
};

export default function BuilderProjectPage() {
  return (
    <Routes>
      <Route index element={<BuilderProjectList />} />
      <Route path=":id" element={<GenericDetailPage />} />
    </Routes>
  );
}
