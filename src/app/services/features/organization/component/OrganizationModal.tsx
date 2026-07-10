import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { Organization, OrganizationFormValues } from "../organization.types";
import { LocationAutocomplete, type LocationSelection } from "../../maps/LocationAutocomplete";

type Props = {
  initialValues?: Organization | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: OrganizationFormValues) => void;
};

const OrganizationModal = ({ initialValues, isSubmitting, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<OrganizationFormValues>({
    name: initialValues?.name ?? "",
    contact_email: initialValues?.contact_email ?? "",
    contact_phone: initialValues?.contact_phone ?? "",
    address: initialValues?.address ?? "",
    business_type: (initialValues?.business_type as OrganizationFormValues["business_type"]) ?? "company",
    business_verification_status: (initialValues?.business_verification_status as OrganizationFormValues["business_verification_status"]) ?? "pending",
    abn: initialValues?.abn ?? "",
    acn: initialValues?.acn ?? "",
    is_verified: initialValues?.is_verified ?? false,
  });

  const handleLocationSelect = (selection: LocationSelection) => {
    setForm((current) => ({
      ...current,
      address: selection.full_address ?? selection.formatted_address ?? selection.address ?? current.address,
    }));
  };

  useEffect(() => {
    setForm({
      name: initialValues?.name ?? "",
      contact_email: initialValues?.contact_email ?? "",
      contact_phone: initialValues?.contact_phone ?? "",
      address: initialValues?.address ?? "",
      business_type: (initialValues?.business_type as OrganizationFormValues["business_type"]) ?? "company",
      business_verification_status: (initialValues?.business_verification_status as OrganizationFormValues["business_verification_status"]) ?? "pending",
      abn: initialValues?.abn ?? "",
      acn: initialValues?.acn ?? "",
      is_verified: initialValues?.is_verified ?? false,
    });
  }, [initialValues]);

  return (
    <ModalShell
      title={initialValues ? "Edit Organization" : "Add Organization"}
      onClose={onClose}
      onSubmit={() => onSubmit(form)}
      isSubmitting={isSubmitting}
      submitLabel={initialValues ? "Update Organization" : "Create Organization"}
      isValid={!!form.name}
    >
      <div className="fv-row mb-4">
        <label className="form-label required">Name</label>
        <input className="form-control form-control-solid" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Email</label>
        <input className="form-control form-control-solid" value={form.contact_email ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, contact_email: e.target.value }))} />
      </div>
      <div className="fv-row mb-4">
        <label className="form-label">Phone</label>
        <input className="form-control form-control-solid" value={form.contact_phone ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, contact_phone: e.target.value }))} />
      </div>
      <LocationAutocomplete
        value={form.address ?? ""}
        onChange={(value) => setForm((prev) => ({ ...prev, address: value }))}
        onSelect={handleLocationSelect}
        label="Address"
        placeholder="Search for an address"
      />
      <div className="row">
        <div className="col-md-6 fv-row mb-4">
          <label className="form-label">Business Type</label>
          <select className="form-select form-select-solid" value={form.business_type} onChange={(e) => setForm((prev) => ({ ...prev, business_type: e.target.value as OrganizationFormValues["business_type"] }))}>
            <option value="organisation">Organisation</option>
            <option value="company">Company</option>
            <option value="solo_trader">Solo Trader</option>
          </select>
        </div>
        <div className="col-md-6 fv-row mb-4">
          <label className="form-label">Verification Status</label>
          <select className="form-select form-select-solid" value={form.business_verification_status} onChange={(e) => setForm((prev) => ({ ...prev, business_verification_status: e.target.value as OrganizationFormValues["business_verification_status"] }))}>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 fv-row mb-4">
          <label className="form-label">ABN</label>
          <input className="form-control form-control-solid" value={form.abn ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, abn: e.target.value }))} />
        </div>
        <div className="col-md-6 fv-row mb-4">
          <label className="form-label">ACN</label>
          <input className="form-control form-control-solid" value={form.acn ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, acn: e.target.value }))} />
        </div>
      </div>
      <div className="fv-row mb-2">
        <label className="form-check form-switch form-check-custom form-check-solid">
          <input className="form-check-input" type="checkbox" checked={Boolean(form.is_verified)} onChange={(e) => setForm((prev) => ({ ...prev, is_verified: e.target.checked }))} />
          <span className="form-check-label ms-3">Verified</span>
        </label>
      </div>
    </ModalShell>
  );
};

export default OrganizationModal;
