import { type FC, type PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useRoleAccess } from './useRoleAccess'
import { getRoleHomeRoute } from './core/roleRoutes'

type RoleGuardProps = PropsWithChildren<{
  allow: string[]
}>

const RoleGuard: FC<RoleGuardProps> = ({allow, children}) => {
  const {roles} = useRoleAccess()
  const location = useLocation()
  const effectiveRoles = roles.includes('super_admin_employee')
    ? [...roles, 'super_admin']
    : roles

  const canAccess = allow.length === 0 || allow.some((role) => effectiveRoles.includes(role))

  if (!canAccess) {
    return <Navigate to={getRoleHomeRoute(effectiveRoles)} state={{from: location}} replace />
  }

  return <>{children}</>
}

export {RoleGuard}
