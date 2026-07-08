import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard, KTIcon } from "../../../_metronic/helpers";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { useRoleAccess } from "../../modules/auth";
import { getAuth } from "../../modules/auth/core/AuthHelpers";
import type { EmailTemplate, EmailTemplateFormValues } from "../../services/features/email_template/email-template.types";
import {
  createEmailTemplateApi,
  deleteEmailTemplateApi,
  fetchEmailTemplatesApi,
  previewEmailTemplateApi,
  sendTestEmailTemplateApi,
  updateEmailTemplateApi,
} from "../../services/features/email_template/email-template.api";

import { EmailTemplateModal } from "../../services/features/email_template/components/EmailTemplateModal";
import { EmailTemplatePreviewModal } from "../../services/features/email_template/components/EmailTemplatePreviewModal";
import { EmailTemplateSendTestModal } from "../../services/features/email_template/components/EmailTemplateSendTestModal";

const EmailTemplatePage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const scope = isSuperAdmin ? "super-admin" : "admin";
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];
  const canCreate = abilities.includes("email_template.create");
  const canUpdate = abilities.includes("email_template.update");
  const canDelete = abilities.includes("email_template.delete");

  const [items, setItems] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [deleting, setDeleting] = useState<EmailTemplate | null>(null);
  const [previewItem, setPreviewItem] = useState<EmailTemplate | null>(null);
  const [sendTestItem, setSendTestItem] = useState<EmailTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchEmailTemplatesApi(scope)
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load email templates");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [scope]);

  const title = useMemo(() => "Email Templates", []);

  const submit = async (payload: EmailTemplateFormValues) => {
    const saved = editing
      ? await updateEmailTemplateApi(scope, editing.id, payload)
      : await createEmailTemplateApi(scope, payload);
    setItems((current) => {
      const idx = current.findIndex((item) => item.id === saved.id);
      if (idx === -1) return [saved, ...current];
      const next = [...current];
      next[idx] = saved;
      return next;
    });
    setEditing(null);
    setIsModalOpen(false);
  };

  const preview = async (variables: Record<string, string | number | boolean>) => {
    if (!previewItem) return {};
    return await previewEmailTemplateApi(scope, previewItem.id, { variables });
  };

  const sendTest = async (email: string, variables: Record<string, string | number | boolean>) => {
    if (!sendTestItem) return "";
    const result = await sendTestEmailTemplateApi(scope, sendTestItem.id, { email, variables });
    return `Test email sent to ${result.email}.`;
  };

  const remove = async () => {
    if (!deleting) return;
    await deleteEmailTemplateApi(scope, deleting.id);
    setItems((current) => current.filter((item) => item.id !== deleting.id));
    setDeleting(null);
  };

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: EmailTemplate) => {
    setEditing(item);
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
            <button className="btn btn-primary" onClick={openCreate} disabled={!canCreate}>
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
                      <span className={`badge badge-light-${(item.is_active ?? item.status === "active") ? "success" : "danger"}`}>
                        {(item.is_active ?? item.status === "active") ? "active" : "inactive"}
                      </span>
                      <div className="d-flex gap-2">
                        <button className="btn btn-icon btn-sm btn-light" onClick={() => setPreviewItem(item)}>
                          <KTIcon iconName="eye" className="fs-4" />
                        </button>
                        <button className="btn btn-icon btn-sm btn-light-warning" onClick={() => setSendTestItem(item)} disabled={!canUpdate}>
                          <KTIcon iconName="send" className="fs-4" />
                        </button>
                        <button className="btn btn-icon btn-sm btn-light-primary" onClick={() => openEdit(item)} disabled={!canUpdate}>
                          <KTIcon iconName="pencil" className="fs-4" />
                        </button>
                        <button className="btn btn-icon btn-sm btn-light-danger" onClick={() => setDeleting(item)} disabled={!canDelete}>
                          <KTIcon iconName="trash" className="fs-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="fw-bold mb-2">{item.name}</h4>
                    <div className="text-muted fs-7 mb-2">{item.slug ?? item.key}</div>
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
        <EmailTemplateModal
          editing={editing}
          onClose={() => {
            setEditing(null);
            setIsModalOpen(false);
          }}
          onSubmit={submit}
        />
      )}

      {previewItem && (
        <EmailTemplatePreviewModal
          template={previewItem}
          onClose={() => setPreviewItem(null)}
          onPreview={preview}
        />
      )}

      {sendTestItem && (
        <EmailTemplateSendTestModal
          template={sendTestItem}
          onClose={() => setSendTestItem(null)}
          onSendTest={sendTest}
        />
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
