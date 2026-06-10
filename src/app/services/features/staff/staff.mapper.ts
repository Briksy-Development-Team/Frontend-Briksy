import type { StaffMember, PlatformPermission } from "./staff.types"

type StaffApi = {
  id: string
  name: string
  email: string
  permissions: string[]
  status: 'active' | 'inactive'
  created_at: string
}

export const mapStaff = (item: StaffApi): StaffMember => ({
  id: item.id,
  name: item.name ?? "",
  email: item.email ?? "",
  permissions: (item.permissions ?? []) as PlatformPermission[],
  status: item.status ?? "active",
  created_at: item.created_at ?? "",
})