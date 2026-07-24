import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { Property } from "../property.types";

export type PropertyReviewAction = "approve" | "reject" | "verify_location" | "unverify_location";

type Props = {
  property: Property;
  action: PropertyReviewAction;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload?: { rejection_reason?: string }) => void;
};

const getActionMeta = (action: PropertyReviewAction) => {
  switch (action) {
    case "approve":
      return {
        title: "Approve Property",
        submitLabel: "Approve",
        description: "This will move the property out of review and mark it as approved.",
      };
    case "reject":
      return {
        title: "Reject Property",
        submitLabel: "Reject",
        description: "Add a rejection reason so the company can correct the listing.",
      };
    case "verify_location":
      return {
        title: "Verify Property Location",
        submitLabel: "Verify",
        description: "This will mark the property location as verified.",
      };
    case "unverify_location":
      return {
        title: "Remove Location Verification",
        submitLabel: "Remove Verification",
        description: "This will clear the current location verification flag.",
      };
  }

  return {
    title: "Review Property",
    submitLabel: "Save",
    description: "",
  };
};

const PropertyReviewModal = ({ property, action, isSubmitting, onClose, onSubmit }: Props) => {
  const meta = getActionMeta(action);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    setRejectionReason("");
  }, [property.id, action]);

  const isReject = action === "reject";

  return (
    <ModalShell
      title={meta.title}
      onClose={onClose}
      onSubmit={() => onSubmit(isReject ? { rejection_reason: rejectionReason.trim() } : undefined)}
      isSubmitting={isSubmitting}
      submitLabel={meta.submitLabel}
      isValid={!isReject || rejectionReason.trim().length > 0}
    >
      <div className="mb-4">
        <div className="text-gray-900 fw-semibold mb-1">{property.title}</div>
        <div className="text-muted fs-7">{property.display_id ?? property.generated_id ?? property.id}</div>
      </div>

      <div className="alert alert-light mb-4">{meta.description}</div>

      {isReject && (
        <div className="fv-row">
          <label className="form-label">Rejection Reason</label>
          <textarea
            className="form-control form-control-solid"
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain what needs to be fixed"
          />
        </div>
      )}
    </ModalShell>
  );
};

export default PropertyReviewModal;
