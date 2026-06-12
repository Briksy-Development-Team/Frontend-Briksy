export const ROLE_HOME_ROUTES: Record<string, string> = {
  super_admin: '/super-admin/dashboard',
  admin: '/admin/dashboard',
  admin_staff: '/admin/dashboard',
}

export const ROLE_PORTAL_BASE_ROUTES: Record<string, string> = {
  super_admin: '/super-admin',
  admin: '/admin',
  admin_staff: '/admin',
}

export const getRoleHomeRoute = (roles: string[] = []): string => {
  if (roles.includes('super_admin')) {
    return ROLE_HOME_ROUTES.super_admin
  }

  if (roles.includes('admin') || roles.includes('admin_staff')) {
    return ROLE_HOME_ROUTES.admin
  }

  return '/auth/login'
}

export const getRolePortalBaseRoute = (roles: string[] = []): string => {
  if (roles.includes('super_admin')) {
    return ROLE_PORTAL_BASE_ROUTES.super_admin
  }

  if (roles.includes('admin') || roles.includes('admin_staff')) {
    return ROLE_PORTAL_BASE_ROUTES.admin
  }

  return '/auth/login'
}

export const isSuperAdminRole = (roles: string[] = []): boolean =>
  roles.includes('super_admin')

export const isAdminRole = (roles: string[] = []): boolean =>
  roles.includes('admin') || roles.includes('admin_staff')
