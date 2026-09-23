import { useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { BuilderProject } from "../builder_project.types";

export type ProjectFormValues = {
  name: string;
  project_type: string;
  status: string;
  location: string;
  state: string;
  postcode: string;
  description: string;
};

type Props = {
  initialValues?: BuilderProject | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void | Promise<unknown>;
};

export const BuilderProjectModal = ({
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState<ProjectFormValues>({
    name: initialValues?.name ?? "",
    project_type: initialValues?.project_type ?? "",
    status: initialValues?.status ?? "planning",
    location: initialValues?.location ?? "",
    state: initialValues?.state ?? "",
    postcode: initialValues?.postcode ?? "",
    description: initialValues?.description ?? "",
  });

  const updateForm = (key: keyof ProjectFormValues, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    await onSubmit(form);
  };

  return (
    <ModalShell
      title={initialValues ? "Edit Project" : "Add Builder Project"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={initialValues ? "Update Project" : "Save Project"}
      isValid={Boolean(form.name.trim())}
      dialogClassName="mw-650px"
    >
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label required">Project Name</label>
          <input
            className="form-control form-control-solid"
            required
            maxLength={150}
            placeholder="e.g. Metro Homes Development"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Project Type</label>
          <input
            className="form-control form-control-solid"
            maxLength={80}
            placeholder="e.g. Townhouse Development"
            value={form.project_type}
            onChange={(e) => updateForm("project_type", e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            className="form-select form-select-solid"
            value={form.status}
            onChange={(e) => updateForm("status", e.target.value)}
          >
            <option value="planning">Planning</option>
            <option value="in_delivery">In Delivery</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Suburb / Location</label>
          <input
            className="form-control form-control-solid"
            maxLength={150}
            placeholder="e.g. Newcastle"
            value={form.location}
            onChange={(e) => updateForm("location", e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">State</label>
          <input
            className="form-control form-control-solid"
            maxLength={10}
            placeholder="NSW"
            value={form.state}
            onChange={(e) => updateForm("state", e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Postcode</label>
          <input
            className="form-control form-control-solid"
            maxLength={10}
            placeholder="2300"
            value={form.postcode}
            onChange={(e) => updateForm("postcode", e.target.value)}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control form-control-solid"
            rows={3}
            placeholder="Provide brief details about this development project..."
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
          />
        </div>
      </div>
    </ModalShell>
  );
};
