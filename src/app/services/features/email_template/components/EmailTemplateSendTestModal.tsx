import { useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { EmailTemplate } from "../email-template.types";

type Props = {
  template: EmailTemplate;
  onClose: () => void;
  onSendTest: (email: string, variables: Record<string, string | number | boolean>) => Promise<string>;
};

export const EmailTemplateSendTestModal = ({ template, onClose, onSendTest }: Props) => {
  const [sendTestEmail, setSendTestEmail] = useState("");
  const [sendTestVariables, setSendTestVariables] = useState("{\"name\":\"Jane\"}");
  const [sendTestMessage, setSendTestMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendTest = async () => {
    setLoading(true);
    try {
      const variables = JSON.parse(sendTestVariables || "{}");
      const message = await onSendTest(sendTestEmail.trim(), variables);
      setSendTestMessage(message);
    } catch (error) {
      setSendTestMessage(error instanceof Error ? error.message : "Failed to send test email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      title={`Send Test: ${template.name}`}
      onClose={onClose}
      onSubmit={handleSendTest}
      isSubmitting={loading}
      submitLabel="Send Test Email"
      isValid={sendTestEmail.trim().length > 0}
    >
      <div className="fv-row mb-4">
        <label className="form-label required">Recipient Email</label>
        <input
          className="form-control form-control-solid"
          type="email"
          value={sendTestEmail}
          onChange={(e) => setSendTestEmail(e.target.value)}
        />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Variables JSON</label>
        <textarea
          className="form-control form-control-solid"
          rows={6}
          value={sendTestVariables}
          onChange={(e) => setSendTestVariables(e.target.value)}
        />
      </div>
      {sendTestMessage && <div className="alert alert-info">{sendTestMessage}</div>}
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
