import { useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { PlanRequest, PlanRequestReviewValues } from "../plan-request.types";

type Props = {
  request: PlanRequest;
  action: "approve" | "reject";
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: PlanRequestReviewValues) => void;
};

export const PlanRequestReviewModal = ({
  request,
  action,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) => {
  const [notes, setNotes] = useState("");

  return (
    <ModalShell
      title={
        action === "approve"
          ? "Approve Request"
          : "Reject Request"
      }
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          admin_notes: notes,
          create_order:
            action === "approve",
          plan_id: request.plan_id,
          organization_id:
            request.organization_id,
        })
      }
      isSubmitting={isSubmitting}
      submitLabel={
        action === "approve"
          ? "Approve"
          : "Reject"
      }
      isValid
    >
      <textarea
        rows={4}
        className="form-control"
        placeholder="Admin Notes"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
      />
    </ModalShell>
  );
};
