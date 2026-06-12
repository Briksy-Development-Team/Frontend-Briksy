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

  const canAccess = allow.length === 0 || allow.some((role) => roles.includes(role))

  if (!canAccess) {
    return <Navigate to={getRoleHomeRoute(roles)} state={{from: location}} replace />
  }

  return <>{children}</>
}

export {RoleGuard}
