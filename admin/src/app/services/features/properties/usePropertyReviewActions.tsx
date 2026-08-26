import { useMemo, useState } from "react";
import type { RowAction } from "../../../modules/apps/shared_table/entity-list/table/EntityTable";
import { useToast } from "../../ui/toast/useToast";
import type { Property } from "./property.types";
import {
  approvePropertyApi,
  rejectPropertyApi,
  unverifyPropertyLocationApi,
  verifyPropertyLocationApi,
} from "./property.api";
import PropertyReviewModal, { type PropertyReviewAction } from "./component/PropertyReviewModal";

type Options = {
  onChanged?: () => void;
};

const isPendingReview = (property: Property) => property.status === "Pending Review";

export const usePropertyReviewActions = ({ onChanged }: Options = {}) => {
  const toast = useToast();
  const [target, setTarget] = useState<Property | null>(null);
  const [action, setAction] = useState<PropertyReviewAction | null>(null);
  const [saving, setSaving] = useState(false);

  const close = () => {
    setTarget(null);
    setAction(null);
  };

  const execute = async (payload?: { rejection_reason?: string }) => {
    if (!target || !action) {
      return;
    }

    setSaving(true);

    try {
      if (action === "approve") {
        await approvePropertyApi(target.id);
        toast.success("Property approved.");
      } else if (action === "reject") {
        await rejectPropertyApi(target.id, payload?.rejection_reason ?? "");
        toast.success("Property rejected.");
      } else if (action === "verify_location") {
        await verifyPropertyLocationApi(target.id);
        toast.success("Property location verified.");
      } else if (action === "unverify_location") {
        await unverifyPropertyLocationApi(target.id);
        toast.success("Property location verification removed.");
      }

      onChanged?.();
      close();
    } finally {
      setSaving(false);
    }
  };

  const rowActions = useMemo<RowAction<Property>[]>(
    () => [
      {
        label: "Approve",
        permission: "property.approve",
        showIf: (property) => isPendingReview(property),
        onClick: (property) => {
          setTarget(property);
          setAction("approve");
        },
      },
      {
        label: "Reject",
        permission: "property.reject",
        showIf: (property) => isPendingReview(property),
        className: "text-danger",
        onClick: (property) => {
          setTarget(property);
          setAction("reject");
        },
      },
      {
        label: "Verify Location",
        permission: "property.verify_location",
        showIf: (property) => !property.location_verified,
        onClick: (property) => {
          setTarget(property);
          setAction("verify_location");
        },
      },
      {
        label: "Remove Location Verification",
        permission: "property.unverify_location",
        showIf: (property) => Boolean(property.location_verified),
        className: "text-danger",
        onClick: (property) => {
          setTarget(property);
          setAction("unverify_location");
        },
      },
    ],
    [],
  );

  const modal = target && action ? (
    <PropertyReviewModal
      property={target}
      action={action}
      isSubmitting={saving}
      onClose={close}
      onSubmit={execute}
    />
  ) : null;

  return { rowActions, modal };
};
