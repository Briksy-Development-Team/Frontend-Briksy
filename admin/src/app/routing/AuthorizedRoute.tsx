import { FC, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../modules/auth'
import { getDefaultPrivateRoute } from '../modules/auth/core/roleRoutes'
import { UserModel } from '../modules/auth/core/_models'

type AuthorizedRouteProps = {
  element: ReactElement
  canAccess: (user: UserModel | undefined) => boolean
}

const AuthorizedRoute: FC<AuthorizedRouteProps> = ({ element, canAccess }) => {
  const { currentUser } = useAuth()

  if (!canAccess(currentUser)) {
    return <Navigate to={getDefaultPrivateRoute(currentUser)} replace />
  }

  return element
}

export { AuthorizedRoute }
