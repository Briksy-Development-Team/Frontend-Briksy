import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { Seeker, SeekerFormValues } from "../seeker.types";

type Props = {
  initialValues?: Seeker | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: SeekerFormValues) => void;
};

const SeekerModal = ({ initialValues, isSubmitting, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<SeekerFormValues>({
    name: initialValues?.name ?? "",
    email: initialValues?.email ?? "",
    display_name: initialValues?.display_name ?? "",
    mobile_number: initialValues?.mobile_number ?? "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    setForm({
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      display_name: initialValues?.display_name ?? "",
      mobile_number: initialValues?.mobile_number ?? "",
      password: "",
      password_confirmation: "",
    });
  }, [initialValues]);

  return (
    <ModalShell
      title={initialValues ? "Edit Seeker" : "Add Seeker"}
      onClose={onClose}
      onSubmit={() => onSubmit(form)}
      isSubmitting={isSubmitting}
      submitLabel={initialValues ? "Update Seeker" : "Create Seeker"}
      isValid={!!form.name && !!form.email}
    >
      <div className="fv-row mb-4">
        <label className="form-label required">Name</label>
        <input className="form-control form-control-solid" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label required">Email</label>
        <input className="form-control form-control-solid" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Display Name</label>
        <input className="form-control form-control-solid" value={form.display_name ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, display_name: e.target.value }))} />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Mobile Number</label>
        <input className="form-control form-control-solid" value={form.mobile_number ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, mobile_number: e.target.value }))} />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Password</label>
        <input type="password" className="form-control form-control-solid" value={form.password ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value, password_confirmation: e.target.value }))} placeholder="Leave blank to keep current password" />
      </div>
    </ModalShell>
  );
};

export default SeekerModal;
