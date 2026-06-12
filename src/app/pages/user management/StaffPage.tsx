import { useDispatch, useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"

import {
  fetchStaff,
  saveStaff,
  openStaffModal,
  closeStaffModal,
} from "../../services/features/staff/staff.slice"
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

const StaffList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isSuperAdmin } = useRoleAccess()
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ['super_admin'] : ['admin'])

  const { data, total, error, isModalOpen, editingStaff, saving } =
    useSelector((s: RootState) => s.staff)

  const { params, handleParamsChange } = useEntityTable(
    (p) => dispatch(fetchStaff(p))
  )

  // refetch after save
  useEffect(() => {
    if (!saving && !isModalOpen) {
      dispatch(fetchStaff(params))
    }
  }, [isModalOpen])

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
    <>
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
          addAction={{
            label: "Add Staff",
            onClick: () => dispatch(openStaffModal(null)),
          }}
          rowActions={[
            {
              label: "Edit",
              onClick: (row) => dispatch(openStaffModal(row)),
            },
            {
              label: "Delete",
              onClick: (row) => dispatch(openStaffModal(row)),
            },
          ]}
        />
      </Content>

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
    </>
  )
}

const StaffPage = () => (
  <Routes>
    <Route index element={<StaffList />} />
    <Route path=":id" element={<GenericDetailPage />} />
  </Routes>
)

export default StaffPage
