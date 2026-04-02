import { UserModel } from './_models'

export const hasRole = (user: UserModel | undefined, roleName: string): boolean => {
  return user?.role_names?.includes(roleName) ?? false
}

export const isAdminStaff = (user: UserModel | undefined): boolean => {
  return hasRole(user, 'admin_staff')
}

export const canAccessDashboard = (user: UserModel | undefined): boolean => {
  return hasRole(user, 'admin')
}

export const canManageStaff = (user: UserModel | undefined): boolean => {
  return hasRole(user, 'admin')
}

export const canManageSubscriptions = (user: UserModel | undefined): boolean => {
  return hasRole(user, 'admin')
}

export const canManageSeekers = (user: UserModel | undefined): boolean => {
  return hasRole(user, 'admin') || hasRole(user, 'admin_staff')
}

export const canManageBusinesses = (user: UserModel | undefined): boolean => {
  return hasRole(user, 'admin') || hasRole(user, 'admin_staff')
}

export const canManageProperties = (user: UserModel | undefined): boolean => {
  return hasRole(user, 'admin') || hasRole(user, 'admin_staff')
}

export const canManageServices = (user: UserModel | undefined): boolean => {
  return hasRole(user, 'admin') || hasRole(user, 'admin_staff')
}

export const getDefaultPrivateRoute = (user: UserModel | undefined): string => {
  if (hasRole(user, 'admin')) {
    return '/dashboard/home'
  }

  if (hasRole(user, 'admin_staff')) {
    return '/apps/seeker-management/seeker'
  }

  return '/dashboard/home'
}
