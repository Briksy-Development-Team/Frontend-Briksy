import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

import { fetchSeekers } from "../../services/features/seeker/seekerSlice";
import { seekerConfig } from "../../services/features/seeker/seeker.config";
import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { getRolePortalBaseRoute } from "../../modules/auth/core/roleRoutes";
import { useRoleAccess } from "../../modules/auth";
import { getAuth } from "../../modules/auth/core/AuthHelpers";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import SeekerModal from "../../services/features/seeker/component/SeekerModal";
import type { Seeker } from "../../services/features/seeker/seeker.types";
import type { SeekerFormValues } from "../../services/features/seeker/seeker.types";
import { updateSeekerApi, deleteSeekerApi } from "../../services/features/seeker/seekerApi";
import { useToast } from "../../services/ui/toast/useToast";

const SeekerList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuperAdmin } = useRoleAccess();
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ['super_admin'] : ['admin']);
  const resolveSeekerId = (row: { id: string; generated_id?: string | null; display_id?: string | null }) =>
    row.display_id ?? row.generated_id ?? row.id;
  const { data, total, error } = useSelector((s: RootState) => s.seeker);

  const { params, handleParamsChange } = useEntityTable(
    (p) => dispatch(fetchSeekers(p))
  );

  if (error) return (
    <Content>
      <PageHeader title="Seekers" subtitle="All registered seekers" />
      <div className="text-danger">{error}</div>
    </Content>
  );

  return (
    <Content>
      <PageHeader title="Seekers" subtitle="All registered seekers" />
      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={seekerConfig.columns}
        filtersConfig={seekerConfig.filters}
        enableRowClick
        getRowLink={(row) => `${portalBase}/seekers/${resolveSeekerId(row)}`}
      />
    </Content>
  );
};

const SeekerPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const auth = getAuth();
  const toast = useToast();
  const abilities = auth?.abilities ?? [];
  const canUpdate = isSuperAdmin && abilities.includes("user.update");
  const canDelete = isSuperAdmin && abilities.includes("user.delete");
  const [editingSeeker, setEditingSeeker] = useState<Seeker | null>(null);
  const [deletingSeeker, setDeletingSeeker] = useState<Seeker | null>(null);
  const [saving, setSaving] = useState(false);

  const rowActions = [
    ...(canUpdate
      ? [
          {
            label: "Edit",
            permission: "user.update",
            onClick: (row: Seeker) => setEditingSeeker(row),
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            label: "Delete",
            permission: "user.delete",
            className: "text-danger",
            onClick: (row: Seeker) => setDeletingSeeker(row),
          },
        ]
      : []),
  ];

  const handleUpdate = async (values: SeekerFormValues) => {
    if (!editingSeeker) return;
    setSaving(true);
    try {
      await updateSeekerApi(editingSeeker.id, values);
      setEditingSeeker(null);
      toast.success("Seeker updated.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSeeker) return;
    setSaving(true);
    try {
      await deleteSeekerApi(deletingSeeker.id);
      setDeletingSeeker(null);
      toast.success("Seeker removed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Routes>
        <Route index element={<SeekerList />} />
        <Route path=":id" element={<GenericDetailPage rowActions={rowActions} />} />
      </Routes>

      {editingSeeker && (
        <SeekerModal
          initialValues={editingSeeker}
          isSubmitting={saving}
          onClose={() => setEditingSeeker(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deletingSeeker && (
        <DeleteConfirmModal
          title="Delete Seeker"
          message={`Are you sure you want to delete "${deletingSeeker.name}"?`}
          onClose={() => setDeletingSeeker(null)}
          onConfirm={handleDelete}
          isSubmitting={saving}
        />
      )}
    </>
  );
};

export default SeekerPage;
