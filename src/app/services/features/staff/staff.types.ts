export const PLATFORM_PERMISSIONS = [
  "organization.view",
  "soloTrader.view",
  "seeker.view",
  "order.view",
  "plan.manage",
  "coupon.manage",
  "emailTemplate.manage",
  "staff.manage",
] as const;

export type PlatformPermission = (typeof PLATFORM_PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<PlatformPermission, string> = {
  "organization.view": "View Organizations",
  "soloTrader.view": "View Solo Traders",
  "seeker.view": "View Seekers",
  "order.view": "View Orders",
  "plan.manage": "Manage Plans",
  "coupon.manage": "Manage Coupons",
  "emailTemplate.manage": "Manage Email Templates",
  "staff.manage": "Manage Staff",
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  permissions: PlatformPermission[];
  status: "active" | "inactive";
  created_at: string;
};

export type StaffFormValues = {
  name: string;
  email: string;
  password?: string;
  permissions: PlatformPermission[];
};

export type GetStaffParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};
