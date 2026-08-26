import { useState } from "react"
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import OrganizationPage from "./user/OrganizationPage"
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage"
import OrganizationModal from "../../services/features/organization/component/OrganizationModal"
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal"
import { useRoleAccess } from "../../modules/auth"
import { useToast } from "../../services/ui/toast/useToast"
import { getAuth } from "../../modules/auth/core/AuthHelpers"
import { updateOrganizationApi, deleteOrganizationApi } from "../../services/features/organization/organization.api"
import type { Organization } from "../../services/features/organization/organization.types"
import type { OrganizationFormValues } from "../../services/features/organization/organization.types"

const UserPage = () => {
  const { isSuperAdmin } = useRoleAccess()
  const toast = useToast()
  const auth = getAuth()
  const abilities = auth?.abilities ?? []
  const canUpdate = isSuperAdmin && abilities.includes("company.update")
  const canDelete = isSuperAdmin && abilities.includes("company.delete")
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null)
  const [deletingOrganization, setDeletingOrganization] = useState<Organization | null>(null)
  const [saving, setSaving] = useState(false)

  const organizationRowActions = [
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
  ]

  const handleUpdate = async (values: OrganizationFormValues) => {
    if (!editingOrganization) return
    setSaving(true)
    try {
      await updateOrganizationApi(editingOrganization.id, values)
      setEditingOrganization(null)
      toast.success("Organization updated.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingOrganization) return
    setSaving(true)
    try {
      await deleteOrganizationApi(deletingOrganization.id)
      setDeletingOrganization(null)
      toast.success("Organization removed.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Routes>
        <Route element={<Outlet />}>
          <Route path="organization" element={<Navigate to="organization/real-estate" replace />} />
          <Route path="organization/real-estate" element={<OrganizationPage key="real-estate" rowActions={organizationRowActions} title="Real Estate" subtitle="All registered real estate organisations" typeSlugs={["real-estate"]} businessTypes={["organisation"]} />} />
          <Route path="organization/buyers-agent" element={<OrganizationPage key="buyers-agent" rowActions={organizationRowActions} title="Buyers Agent" subtitle="All registered buyers agent organisations" typeSlugs={["buyers-agent"]} businessTypes={["organisation"]} />} />
          <Route path="organization/builders" element={<OrganizationPage key="builders" rowActions={organizationRowActions} title="Builders" subtitle="All registered builder companies" typeSlugs={["builders"]} businessTypes={["company"]} />} />
          <Route path="organization/trades-professionals" element={<OrganizationPage key="trades-professionals" rowActions={organizationRowActions} title="Trades & Professionals" subtitle="All registered trade and professional companies" typeSlugs={["trades-professionals"]} businessTypes={["company"]} />} />
          <Route path="organization/:id" element={<GenericDetailPage rowActions={organizationRowActions} />} />
          <Route index element={<Navigate to="organization/real-estate" replace />} />
        </Route>
      </Routes>

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
  )
}

export default UserPage
