import { useMemo } from 'react'
import { useAuth } from './core/Auth'
import { useRoleAccess } from './useRoleAccess'

export const usePermissionAccess = () => {
  const { permissions: authPermissions } = useAuth()
  const { isSuperAdmin } = useRoleAccess()

  return useMemo(() => {
    const permissions = (authPermissions ?? []).map(String)

    const hasPermission = (permission: string) => {
      if (isSuperAdmin) {
        return true
      }

      return permissions.includes(permission)
    }

    const hasAnyPermission = (required: string[]) => {
      if (isSuperAdmin) {
        return true
      }

      return required.some((permission) => permissions.includes(permission))
    }

    const hasAllPermissions = (required: string[]) => {
      if (isSuperAdmin) {
        return true
      }

      return required.every((permission) => permissions.includes(permission))
    }

    return {
      permissions,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      isSuperAdmin,
    }
  }, [authPermissions, isSuperAdmin])
}
