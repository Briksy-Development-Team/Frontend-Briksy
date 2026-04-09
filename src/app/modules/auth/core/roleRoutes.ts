export const ROLE_HOME_ROUTES: Record<string, string> = {
  admin: '/dashboard',
  admin_staff: '/dashboard',
}

export const getRoleHomeRoute = (roles: string[] = []): string => {
  if (roles.includes('admin')) {
    return ROLE_HOME_ROUTES.admin
  }

  if (roles.includes('admin_staff')) {
    return ROLE_HOME_ROUTES.admin_staff
  }

  return '/auth/login'
}
