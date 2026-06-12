import { type FC, type PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usePermissionAccess } from './usePermissionAccess'

type PermissionGuardProps = PropsWithChildren<{
  anyOf?: string[]
  allOf?: string[]
}>

const PermissionGuard: FC<PermissionGuardProps> = ({ anyOf = [], allOf = [], children }) => {
  const { hasAnyPermission, hasAllPermissions, permissions } = usePermissionAccess()
  const location = useLocation()

  const allowed =
    (anyOf.length === 0 || hasAnyPermission(anyOf)) &&
    (allOf.length === 0 || hasAllPermissions(allOf))

  if (!allowed) {
    return <Navigate to="/error/403" state={{ from: location, permissions }} replace />
  }

  return <>{children}</>
}

export { PermissionGuard }
