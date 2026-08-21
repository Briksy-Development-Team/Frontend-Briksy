import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import OrganizationPage from "./user/OrganizationPage";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import OrganizationModal from "../../services/features/organization/component/OrganizationModal";
import { useRoleAccess } from "../../modules/auth";
import { getAuth } from "../../modules/auth/core/AuthHelpers";
import { useToast } from "../../services/ui/toast/useToast";
import type { Organization, OrganizationFormValues } from "../../services/features/organization/organization.types";
import { updateOrganizationApi } from "../../services/features/organization/organization.api";

const CompanyPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const auth = getAuth();
  const toast = useToast();
  const abilities = auth?.abilities ?? [];
  const canUpdate = !isSuperAdmin && abilities.includes("company.update");
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [saving, setSaving] = useState(false);

  const rowActions = canUpdate
    ? [
        {
          label: "Edit",
          permission: "company.update",
          onClick: (row: Organization) => setEditingOrganization(row),
        },
      ]
    : [];

  const handleUpdate = async (values: OrganizationFormValues) => {
    if (!editingOrganization) return;
    setSaving(true);
    try {
      await updateOrganizationApi(editingOrganization.id, values);
      setEditingOrganization(null);
      toast.success("Organization updated.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Routes>
        <Route index element={<OrganizationPage />} />
        <Route path=":id" element={<GenericDetailPage rowActions={rowActions} />} />
      </Routes>

      {editingOrganization && (
        <OrganizationModal
          initialValues={editingOrganization}
          isSubmitting={saving}
          onClose={() => setEditingOrganization(null)}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
};

export default CompanyPage;
