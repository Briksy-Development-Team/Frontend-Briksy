import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard, KTIcon } from "../../../_metronic/helpers";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { useRoleAccess } from "../../modules/auth";
import type { EmailTemplate, EmailTemplateFormValues } from "../../services/features/email_template/email-template.types";
import {
  createEmailTemplateApi,
  deleteEmailTemplateApi,
  fetchEmailTemplatesApi,
  previewEmailTemplateApi,
  updateEmailTemplateApi,
} from "../../services/features/email_template/email-template.api";

const emptyForm: EmailTemplateFormValues = {
  key: "",
  name: "",
  subject: "",
  body: "",
  variables: [],
  status: "active",
};

const EmailTemplatePage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const scope = isSuperAdmin ? "super-admin" : "admin";
  const [items, setItems] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [deleting, setDeleting] = useState<EmailTemplate | null>(null);
  const [previewItem, setPreviewItem] = useState<EmailTemplate | null>(null);
  const [previewJson, setPreviewJson] = useState("{\"name\":\"Jane\",\"order_number\":\"ORD-001\"}");
  const [previewResult, setPreviewResult] = useState<{ subject?: string; body?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<EmailTemplateFormValues>(emptyForm);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchEmailTemplatesApi(scope)
      .then((data) => {
        if (active) {
          setItems(data);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load email templates");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [scope]);

  const title = useMemo(() => "Email Templates", []);

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        variables: Array.isArray(form.variables) ? form.variables : [],
      };
      const saved = editing
        ? await updateEmailTemplateApi(scope, editing.id, payload)
        : await createEmailTemplateApi(scope, payload);
      setItems((current) => {
        const idx = current.findIndex((item) => item.id === saved.id);
        if (idx === -1) {
          return [saved, ...current];
        }
        const next = [...current];
        next[idx] = saved;
        return next;
      });
      setEditing(null);
      setIsModalOpen(false);
      setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  };

  const preview = async () => {
    if (!previewItem) {
      return;
    }

    setPreviewLoading(true);
    try {
      const variables = JSON.parse(previewJson || "{}");
      const result = await previewEmailTemplateApi(scope, previewItem.id, { variables });
      setPreviewResult(result);
    } catch (error) {
      setPreviewResult({ subject: error instanceof Error ? error.message : "Invalid preview JSON" });
    } finally {
      setPreviewLoading(false);
    }
  };

  const remove = async () => {
    if (!deleting) {
      return;
    }

    await deleteEmailTemplateApi(scope, deleting.id);
    setItems((current) => current.filter((item) => item.id !== deleting.id));
    setDeleting(null);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (item: EmailTemplate) => {
    setEditing(item);
    setForm({
      key: item.key,
      name: item.name,
      subject: item.subject,
      body: item.body,
      variables: item.variables ?? [],
      status: item.status,
    });
    setIsModalOpen(true);
  };

  return (
    <Content>
      <PageHeader title={title} subtitle="Manage automated emails and preview rendered messages." />

      <KTCard>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h3 className="fw-bold mb-1">{title}</h3>
              <div className="text-muted">{items.length} templates configured</div>
            </div>
            <button className="btn btn-primary" onClick={openCreate}>
              <KTIcon iconName="plus" className="fs-2 me-2" />
              Add Template
            </button>
          </div>

          {loading && <div className="alert alert-light">Loading templates...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="alert alert-info">No templates found.</div>
          )}

          <div className="row g-5">
            {items.map((item) => (
              <div className="col-xl-4 col-md-6" key={item.id}>
                <div className="card h-100 border">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between mb-3">
                      <span className={`badge badge-light-${item.status === "active" ? "success" : "danger"}`}>
                        {item.status}
                      </span>
                      <div className="d-flex gap-2">
                        <button className="btn btn-icon btn-sm btn-light" onClick={() => setPreviewItem(item)}>
                          <KTIcon iconName="eye" className="fs-4" />
                        </button>
                        <button className="btn btn-icon btn-sm btn-light-primary" onClick={() => openEdit(item)}>
                          <KTIcon iconName="pencil" className="fs-4" />
                        </button>
                        <button className="btn btn-icon btn-sm btn-light-danger" onClick={() => setDeleting(item)}>
                          <KTIcon iconName="trash" className="fs-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="fw-bold mb-2">{item.name}</h4>
                    <div className="text-muted fs-7 mb-2">{item.key}</div>
                    <div className="fw-semibold mb-3">{item.subject}</div>
                    <div className="text-muted fs-7 flex-grow-1" style={{ whiteSpace: "pre-wrap" }}>
                      {item.body}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </KTCard>

      {isModalOpen && (
        <ModalShell
          title={editing ? "Edit Email Template" : "Add Email Template"}
          onClose={() => {
            setEditing(null);
            setForm(emptyForm);
            setIsModalOpen(false);
          }}
          onSubmit={submit}
          isSubmitting={submitting}
          submitLabel={editing ? "Update" : "Create"}
          isValid={form.key.trim().length > 0 && form.name.trim().length > 0 && form.subject.trim().length > 0 && form.body.trim().length > 0}
        >
          <div className="fv-row mb-4">
            <label className="form-label required">Key</label>
            <input className="form-control form-control-solid" value={form.key} onChange={(e) => setForm((current) => ({ ...current, key: e.target.value }))} />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label required">Name</label>
            <input className="form-control form-control-solid" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label required">Subject</label>
            <input className="form-control form-control-solid" value={form.subject} onChange={(e) => setForm((current) => ({ ...current, subject: e.target.value }))} />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label required">Body</label>
            <textarea className="form-control form-control-solid" rows={8} value={form.body} onChange={(e) => setForm((current) => ({ ...current, body: e.target.value }))} />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label">Variables</label>
            <input
              className="form-control form-control-solid"
              value={form.variables.join(", ")}
              onChange={(e) => setForm((current) => ({ ...current, variables: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) }))}
            />
          </div>
          <div className="fv-row mb-2">
            <label className="form-label">Status</label>
            <select className="form-select form-select-solid" value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value as EmailTemplateFormValues["status"] }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </ModalShell>
      )}

      {previewItem && (
        <ModalShell
          title={`Preview: ${previewItem.name}`}
          onClose={() => {
            setPreviewItem(null);
            setPreviewResult(null);
          }}
          onSubmit={preview}
          isSubmitting={previewLoading}
          submitLabel="Render Preview"
          isValid={true}
        >
          <div className="fv-row mb-4">
            <label className="form-label">Variables JSON</label>
            <textarea className="form-control form-control-solid" rows={6} value={previewJson} onChange={(e) => setPreviewJson(e.target.value)} />
          </div>
          {previewResult && (
            <div className="alert alert-light">
              <div className="fw-bold mb-2">{previewResult.subject}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{previewResult.body}</div>
            </div>
          )}
        </ModalShell>
      )}

      {deleting && (
        <DeleteConfirmModal
          title="Delete Email Template"
          message={`Delete ${deleting.name}?`}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </Content>
  );
};

export default EmailTemplatePage;
