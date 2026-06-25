import { useDispatch, useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"

import {
  fetchStaff,
  saveStaff,
  deleteStaff,
  openStaffModal,
  closeStaffModal,
  openDeleteStaffModal,
  closeDeleteStaffModal,
} from "../../services/features/staff/staff.slice";

import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { staffConfig } from "../../services/features/staff/staff.config"
import type { RootState, AppDispatch } from "../../services/store/index"

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable"
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList"
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader"
import { Content } from "../../../_metronic/layout/components/content"
import { StaffModal } from "../../services/features/staff/component/StaffModal"
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage"
import { useRoleAccess } from "../../modules/auth"
import { getRolePortalBaseRoute } from "../../modules/auth/core/roleRoutes"

const StaffList = ({ rowActions }: { rowActions: any[] }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isSuperAdmin } = useRoleAccess()
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ['super_admin'] : ['admin'])

  const {
    data,
    total,
    error,
    isModalOpen,
    saving,
  } = useSelector((s: RootState) => s.staff)

  const { params, handleParamsChange } = useEntityTable(
    (p) => dispatch(fetchStaff(p))
  )

  // refetch after save
  useEffect(() => {
    if (!saving && !isModalOpen) {
      dispatch(fetchStaff(params))
    }
  }, [isModalOpen, saving, params, dispatch])

  if (error) return (
    <Content>
      <PageHeader
        title={isSuperAdmin ? "Platform Staff" : "User Management"}
        subtitle={isSuperAdmin ? "Manage platform staff access and permissions" : "Manage company users"}
      />
      <div className="alert alert-danger">{error}</div>
    </Content>
  )

  return (
    <Content>
      <PageHeader
        title={isSuperAdmin ? "Platform Staff" : "User Management"}
        subtitle={isSuperAdmin ? "Manage platform staff access and permissions" : "Manage company users"}
      />

      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={staffConfig.columns}
        filtersConfig={staffConfig.filters}
        enableRowClick
        getRowLink={(row) => `${portalBase}/staff/${row.id}`}
        storageKey="staffColumns"
        headerActions={[{
          label: "Add Staff",
          onClick: () => dispatch(openStaffModal(null)),
        }]}
        rowActions={rowActions}
      />
    </Content>
  )
}

const StaffPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  
  const {
    isModalOpen,
    editingStaff,
    deleteModalOpen,
    deletingStaff,
    saving,
  } = useSelector((s: RootState) => s.staff)

  const rowActions = [
    {
      label: "Edit",
      onClick: (row: any) => dispatch(openStaffModal(row)),
    },
    {
      label: "Delete",
      className: "text-danger",
      onClick: (row: any) =>
        dispatch(openDeleteStaffModal(row)),
    },
  ];

  return (
    <>
      <Routes>
        <Route index element={<StaffList rowActions={rowActions} />} />
        <Route path=":id" element={<GenericDetailPage rowActions={rowActions} />} />
      </Routes>

      {isModalOpen && (
        <StaffModal
          initialValues={editingStaff}
          isSubmitting={saving}
          onClose={() => dispatch(closeStaffModal())}
          onSubmit={(values) =>
            dispatch(saveStaff({ id: editingStaff?.id, values }))
          }
        />
      )}

      {deleteModalOpen && deletingStaff && (
        <DeleteConfirmModal
          title="Delete Staff"
          message={`Are you sure you want to delete ${deletingStaff.name}?`}
          onClose={() =>
            dispatch(closeDeleteStaffModal())
          }
          onConfirm={() =>
            dispatch(deleteStaff(deletingStaff.id))
          }
        />
      )}
    </>
  )
}

export default StaffPage
