import { useState } from "react";
import { EnquiryModal } from "../../shared/EnquiryModal";
import { createInquiry } from "../../../../api/seeker/inquiry.api";

export const ServiceEnquiry = ({ open, onClose, organizationId, companyName, subject }: {
  open: boolean;
  onClose: () => void;
  organizationId?: string;
  companyName?: string;
  subject: string;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <EnquiryModal
      open={open}
      companyName={companyName}
      initialSubject={subject}
      submitting={submitting}
      error={error}
      success={success}
      onClose={onClose}
      onSubmit={async (values) => {
        if (!organizationId) {
          setError("This listing has no organisation attached yet.");
          return;
        }
        setSubmitting(true);
        setError(null);
        try {
          await createInquiry({
            organization_id: organizationId,
            lead_source: "service_profile",
            subject: values.subject,
            message: values.message,
            seeker_name: values.seeker_name,
            seeker_email: values.seeker_email,
            seeker_phone: values.seeker_phone || null,
          });
          setSuccess("Your enquiry has been sent successfully.");
        } catch (reason: any) {
          setError(reason?.response?.data?.message || "Unable to send enquiry. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    />
  );
};
