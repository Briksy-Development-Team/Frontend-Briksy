import type { Staff, PlatformPermission } from "./staff.types"

type StaffApi = {
  id: string
  generated_id?: string | null
  display_id?: string | null
  name: string
  email: string
  permissions: string[]
  status: 'active' | 'inactive'
  created_at: string
}

export const mapStaff = (item: StaffApi): Staff => ({
  id: item.id,
  generated_id: item.generated_id ?? null,
  display_id: item.display_id ?? item.generated_id ?? item.id,
  name: item.name ?? "",
  email: item.email ?? "",
  permissions: (item.permissions ?? []) as PlatformPermission[],
  status: item.status ?? "active",
  created_at: item.created_at ?? "",
  // Optional fields that may be present in API responses
  display_name: (item as any).display_name,
  organization_id: (item as any).organization_id,
  mobile_number: (item as any).mobile_number,
  roles: (item as any).roles,
  email_verified_at: (item as any).email_verified_at,
  mobile_verified_at: (item as any).mobile_verified_at,
  updated_at: (item as any).updated_at,
})
