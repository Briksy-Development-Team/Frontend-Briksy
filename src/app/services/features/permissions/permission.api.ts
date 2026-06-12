import axiosInstance from '../../api/axiosInstance'
import { getAuth } from '../../../modules/auth/core/AuthHelpers'
import type {
  Permission,
  PermissionGroup,
  RoleSummary,
  UserPermissionOverride,
  UserPermissionSnapshot,
} from './permission.types'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

const superAdminBase = '/super-admin/permissions'

export async function fetchMyPermissionsApi() {
  const response = await axiosInstance.get<ApiEnvelope<UserPermissionSnapshot>>('/me/permissions')
  return response.data
}

export async function fetchPermissionsApi(params?: { search?: string; module?: string; action?: string }) {
  const response = await axiosInstance.get<ApiEnvelope<{ items: Permission[]; grouped: PermissionGroup[] }>>(
    `${superAdminBase}`,
    { params },
  )
  return response.data
}

export async function fetchRolesApi() {
  const response = await axiosInstance.get<ApiEnvelope<RoleSummary[]>>(`${superAdminBase}/roles`)
  return response.data
}

export async function fetchRolePermissionsApi(roleId: string) {
  const response = await axiosInstance.get<ApiEnvelope<{ role: RoleSummary; permissions: Permission[]; grouped: PermissionGroup[] }>>(
    `${superAdminBase}/roles/${roleId}/permissions`,
  )
  return response.data
}

export async function syncRolePermissionsApi(roleId: string, permissionIds: string[]) {
  const response = await axiosInstance.put<ApiEnvelope<{ role: RoleSummary; permissions: Permission[]; grouped: PermissionGroup[] }>>(
    `${superAdminBase}/roles/${roleId}/permissions`,
    { permission_ids: permissionIds },
  )
  return response.data
}

export async function fetchUsersApi(search = '') {
  const response = await axiosInstance.get<ApiEnvelope<Array<{ id: string; name: string; email: string; permissions?: string[] }>>>(
    `${superAdminBase}/users`,
    { params: search ? { search } : undefined },
  )
  return response.data
}

export async function fetchUserPermissionsApi(userId: string) {
  const response = await axiosInstance.get<ApiEnvelope<UserPermissionSnapshot>>(`${superAdminBase}/users/${userId}/permissions`)
  return response.data
}

export async function syncUserPermissionsApi(userId: string, overrides: UserPermissionOverride[]) {
  const response = await axiosInstance.put<ApiEnvelope<UserPermissionSnapshot>>(
    `${superAdminBase}/users/${userId}/permissions`,
    { overrides },
  )
  return response.data
}

export function canUsePermissionManagement() {
  const auth = getAuth()
  return auth?.abilities?.includes('super_admin')
}
