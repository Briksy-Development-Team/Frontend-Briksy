export type Permission = {
  id: string
  name: string
  display_name?: string | null
  module: string
  action: string
  description?: string | null
  guard_name?: string
  is_system?: boolean
  created_at?: string | null
}

export type PermissionGroup = {
  module: string
  permissions: Permission[]
}

export type RoleSummary = {
  id: string
  name: string
  scope: string
  is_system: boolean
  permissions_count: number
}

export type UserPermissionOverride = {
  permission_id: string
  effect: 'allow' | 'deny'
}

export type UserPermissionSnapshot = {
  user: {
    id: string
    name: string
    email: string
    organization_id: string | null
    roles: string[]
  }
  roles: string[]
  role_permissions: Array<{
    id: string
    name: string
    display_name?: string | null
    module: string
    action: string
    role_id: string
    role_name: string
  }>
  direct_permissions: Array<{
    id: string
    name: string
    display_name?: string | null
    module: string
    action: string
    effect: 'allow' | 'deny'
  }>
  effective_permissions: Permission[]
  effective_permission_names: string[]
  grouped: PermissionGroup[]
}
