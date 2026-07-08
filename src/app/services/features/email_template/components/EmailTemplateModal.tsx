import { useState, useEffect } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { EmailTemplate, EmailTemplateFormValues } from "../email-template.types";

const emptyForm: EmailTemplateFormValues = {
  key: "",
  slug: "",
  name: "",
  subject: "",
  body: "",
  variables: [],
  status: "active",
  is_active: true,
  module: "",
  event_key: "",
};

type Props = {
  editing: EmailTemplate | null;
  onClose: () => void;
  onSubmit: (payload: EmailTemplateFormValues) => Promise<void>;
};

export const EmailTemplateModal = ({ editing, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<EmailTemplateFormValues>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        key: editing.key ?? editing.slug ?? "",
        slug: editing.slug ?? editing.key ?? "",
        name: editing.name,
        subject: editing.subject,
        body: editing.body,
        variables: editing.variables ?? [],
        status: editing.status ?? (editing.is_active ? "active" : "inactive"),
        is_active: editing.is_active ?? editing.status === "active",
        module: editing.module ?? "",
        event_key: editing.event_key ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        key: form.key || form.slug || "",
        slug: form.slug || form.key || "",
        variables: Array.isArray(form.variables) ? form.variables : [],
        is_active: form.is_active ?? form.status === "active",
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const isValid =
    (form.slug ?? form.key).trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.subject.trim().length > 0 &&
    form.body.trim().length > 0;

  return (
    <ModalShell
      title={editing ? "Edit Email Template" : "Add Email Template"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={submitting}
      submitLabel={editing ? "Update" : "Create"}
      isValid={isValid}
    >
      <div className="fv-row mb-4">
        <label className="form-label required">Slug / Key</label>
        <input
          className="form-control form-control-solid"
          value={form.slug ?? form.key}
          onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value, key: e.target.value }))}
        />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label required">Name</label>
        <input
          className="form-control form-control-solid"
          value={form.name}
          onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
        />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Module</label>
        <input
          className="form-control form-control-solid"
          value={form.module ?? ""}
          onChange={(e) => setForm((c) => ({ ...c, module: e.target.value }))}
        />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Event Key</label>
        <input
          className="form-control form-control-solid"
          value={form.event_key ?? ""}
          onChange={(e) => setForm((c) => ({ ...c, event_key: e.target.value }))}
        />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label required">Subject</label>
        <input
          className="form-control form-control-solid"
          value={form.subject}
          onChange={(e) => setForm((c) => ({ ...c, subject: e.target.value }))}
        />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label required">Body</label>
        <textarea
          className="form-control form-control-solid"
          rows={8}
          value={form.body}
          onChange={(e) => setForm((c) => ({ ...c, body: e.target.value }))}
        />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Variables</label>
        <input
          className="form-control form-control-solid"
          value={form.variables.join(", ")}
          onChange={(e) =>
            setForm((c) => ({
              ...c,
              variables: e.target.value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean),
            }))
          }
        />
      </div>
      <div className="fv-row mb-4">
        <label className="form-check form-check-custom form-check-solid form-switch d-flex align-items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="form-check-input"
            checked={form.is_active ?? form.status === "active"}
            onChange={(e) =>
              setForm((c) => ({
                ...c,
                is_active: e.target.checked,
                status: e.target.checked ? "active" : "inactive",
              }))
            }
          />
          <span className="fw-bold fs-6">Active</span>
        </label>
      </div>
      <div className="alert alert-light border border-dashed">
        <div className="fw-bold mb-2">Available placeholders</div>
        <div className="d-flex flex-wrap gap-2">
          {[
            "{{company_name}}",
            "{{user_name}}",
            "{{plan_name}}",
            "{{amount}}",
            "{{billing_cycle}}",
            "{{renewal_date}}",
            "{{app_name}}",
          ].map((placeholder) => (
            <span key={placeholder} className="badge badge-light-primary">
              {placeholder}
            </span>
          ))}
        </div>
      </div>
    </ModalShell>
  );
};
