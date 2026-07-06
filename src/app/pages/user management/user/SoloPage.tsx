import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import GenericDetailPage from "../../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { fetchOrganization } from "../../../services/features/organization/organization.slice";
import { organizationConfig } from "../../../services/features/organization/organization.config";
import OrganizationModal from "../../../services/features/organization/component/OrganizationModal";
import { DeleteConfirmModal } from "../../../modules/apps/component/DeleteConfirmModal";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { useToast } from "../../../services/ui/toast/useToast";
import type { RootState, AppDispatch } from "../../../services/store";
import { useEntityTable } from "../../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../../_metronic/layout/components/content";
import { getRolePortalBaseRoute, useRoleAccess } from "../../../modules/auth";
import type { Organization, OrganizationFormValues } from "../../../services/features/organization/organization.types";
import { updateOrganizationApi, deleteOrganizationApi } from "../../../services/features/organization/organization.api";

const SOLO_TRADER_SERVICES = [
  { label: "Electrical", value: "electrical" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Fencing", value: "fencing" },
  { label: "Landscapers", value: "landscapers" },
  { label: "Conveyancers", value: "conveyancers" },
  { label: "Brokers", value: "brokers" },
];

const SoloPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuperAdmin } = useRoleAccess();
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ["super_admin"] : ["admin"]);
  const resolveOrganizationId = (row: { id: string; generated_id?: string | null; display_id?: string | null }) =>
    row.display_id ?? row.generated_id ?? row.id;
  const { data, total, error } = useSelector((s: RootState) => s.organization);

  const { params, handleParamsChange } = useEntityTable(
    (p) => dispatch(fetchOrganization(p)),
    { filters: { type_slug: ["solo-traders"] } }
  );

  const handleSoloParamsChange = (next: typeof params) => {
    handleParamsChange({
      ...next,
      filters: {
        ...(next.filters ?? {}),
        type_slug: ["solo-traders"],
      },
    });
  };

  const filtersConfig = [
    ...organizationConfig.filters,
    {
      key: "service_slug",
      label: "Service",
      type: "select" as const,
      options: SOLO_TRADER_SERVICES,
    },
  ];

  if (error) {
    return (
      <Content>
        <PageHeader title="Solo Traders" subtitle="Filter and inspect solo trader organizations" />
        <div className="text-danger">{error}</div>
      </Content>
    );
  }

  return (
    <Content>
      <PageHeader title="Solo Traders" subtitle="Solo trader organizations and service tags" />
      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleSoloParamsChange}
        columns={organizationConfig.columns}
        filtersConfig={filtersConfig}
        enableRowClick
        getRowLink={(row) => `${portalBase}/companies/solo-traders/detail/${resolveOrganizationId(row)}`}
      />
    </Content>
  );
};

const SoloPageWrapper = () => (
  <>
    <Routes>
        <Route index element={<SoloPage />} />
        <Route path="detail/:id" element={<SoloDetailPage />} />
    </Routes>
  </>
);

const SoloDetailPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const auth = getAuth();
  const toast = useToast();
  const abilities = auth?.abilities ?? [];
  const canUpdate = isSuperAdmin && abilities.includes("company.update");
  const canDelete = isSuperAdmin && abilities.includes("company.delete");
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [deletingOrganization, setDeletingOrganization] = useState<Organization | null>(null);
  const [saving, setSaving] = useState(false);

  const rowActions = [
    ...(canUpdate
      ? [
          {
            label: "Edit",
            permission: "company.update",
            onClick: (row: Organization) => setEditingOrganization(row),
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            label: "Delete",
            permission: "company.delete",
            className: "text-danger",
            onClick: (row: Organization) => setDeletingOrganization(row),
          },
        ]
      : []),
  ];

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

  const handleDelete = async () => {
    if (!deletingOrganization) return;
    setSaving(true);
    try {
      await deleteOrganizationApi(deletingOrganization.id);
      setDeletingOrganization(null);
      toast.success("Organization removed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <GenericDetailPage rowActions={rowActions} />

      {editingOrganization && (
        <OrganizationModal
          initialValues={editingOrganization}
          isSubmitting={saving}
          onClose={() => setEditingOrganization(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deletingOrganization && (
        <DeleteConfirmModal
          title="Delete Organization"
          message={`Are you sure you want to delete "${deletingOrganization.name}"?`}
          onClose={() => setDeletingOrganization(null)}
          onConfirm={handleDelete}
          isSubmitting={saving}
        />
      )}
    </>
  );
};

export default SoloPageWrapper;
