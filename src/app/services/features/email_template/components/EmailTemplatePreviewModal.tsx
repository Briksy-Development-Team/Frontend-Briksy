import { useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { EmailTemplate } from "../email-template.types";

type Props = {
  template: EmailTemplate;
  onClose: () => void;
  onPreview: (variables: Record<string, string | number | boolean>) => Promise<{ subject?: string; body?: string }>;
};

export const EmailTemplatePreviewModal = ({ template, onClose, onPreview }: Props) => {
  const [previewJson, setPreviewJson] = useState("{\"name\":\"Jane\",\"order_number\":\"ORD-001\"}");
  const [previewResult, setPreviewResult] = useState<{ subject?: string; body?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const variables = JSON.parse(previewJson || "{}");
      const result = await onPreview(variables);
      setPreviewResult(result);
    } catch (error) {
      setPreviewResult({ subject: error instanceof Error ? error.message : "Invalid preview JSON" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      title={`Preview: ${template.name}`}
      onClose={onClose}
      onSubmit={handlePreview}
      isSubmitting={loading}
      submitLabel="Render Preview"
      isValid={true}
    >
      <div className="fv-row mb-4">
        <label className="form-label">Variables JSON</label>
        <textarea
          className="form-control form-control-solid"
          rows={6}
          value={previewJson}
          onChange={(e) => setPreviewJson(e.target.value)}
        />
      </div>
      {previewResult && (
        <div className="alert alert-light">
          <div className="fw-bold mb-2">{previewResult.subject}</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{previewResult.body}</div>
        </div>
      )}
    </ModalShell>
  );
};
