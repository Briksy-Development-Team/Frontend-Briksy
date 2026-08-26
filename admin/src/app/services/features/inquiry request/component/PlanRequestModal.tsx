import { useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { PlanRequest, PlanRequestFormValues } from "../plan-request.types";

type Props = {
  initialValues?: PlanRequest | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: PlanRequestFormValues) => void;
};

export const PlanRequestModal = ({
  initialValues,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState<PlanRequestFormValues>({
    organization_id: initialValues?.organization_id ?? "",
    plan_id: initialValues?.plan_id ?? "",
    company_name: initialValues?.company_name ?? "",
    contact_name: initialValues?.contact_name ?? "",
    contact_email: initialValues?.contact_email ?? "",
    contact_phone: initialValues?.contact_phone ?? "",
    requested_plan_name: initialValues?.requested_plan_name ?? "",
    billing_cycle: initialValues?.billing_cycle ?? "monthly",
    // message: initialValues?.message ?? "",
    admin_notes: initialValues?.admin_notes ?? "",
  });

  return (
    <ModalShell
      title={initialValues ? "Edit Plan Request" : "Create Plan Request"}
      onClose={onClose}
      onSubmit={() => onSubmit(form)}
      isSubmitting={isSubmitting}
      submitLabel={initialValues ? "Update" : "Create"}
      isValid
    >
      <div className="fv-row mb-4">
        <label className="form-label">Company Name</label>

        <input
          className="form-control form-control-solid"
          value={form.company_name ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              company_name: e.target.value,
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Contact Name</label>

        <input
          className="form-control form-control-solid"
          value={form.contact_name ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              contact_name: e.target.value,
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Contact Email</label>

        <input
          className="form-control form-control-solid"
          value={form.contact_email ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              contact_email: e.target.value,
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Contact Phone</label>

        <input
          className="form-control form-control-solid"
          value={form.contact_phone ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              contact_phone: e.target.value,
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Requested Plan</label>

        <input
          className="form-control form-control-solid"
          value={form.requested_plan_name ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              requested_plan_name: e.target.value,
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Billing Cycle</label>

        <select
          className="form-select form-select-solid"
          value={form.billing_cycle ?? "monthly"}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              billing_cycle: e.target.value,
            }))
          }
        >
          <option value="monthly">Monthly</option>

          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Organization ID</label>

        <input
          className="form-control form-control-solid"
          value={form.organization_id ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              organization_id: e.target.value,
            }))
          }
        />
      </div>
    </ModalShell>
  );
};
