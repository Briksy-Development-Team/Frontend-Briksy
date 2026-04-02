import { FC } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../modules/auth'
import { canAccessDashboard, getDefaultPrivateRoute } from '../modules/auth/core/roleRoutes'

type RoleBasedRedirectProps = {
  requireDashboardAccess?: boolean
}

const RoleBasedRedirect: FC<RoleBasedRedirectProps> = ({ requireDashboardAccess = false }) => {
  const { currentUser } = useAuth()
  const targetRoute =
    requireDashboardAccess && !canAccessDashboard(currentUser)
      ? getDefaultPrivateRoute(currentUser)
      : getDefaultPrivateRoute(currentUser)

  return <Navigate to={targetRoute} replace />
}

export { RoleBasedRedirect }
