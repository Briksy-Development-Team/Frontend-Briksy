export const ADMIN_PERMISSIONS = [
  "dashboard.view",
  "property.view",
  "property.create",
  "property.update",
  "property.delete",
  "service.view",
  "service.create",
  "service.update",
  "service.delete",
  "user.view",
  "user.create",
  "user.update",
  "user.delete",
  "settings.view",
  "settings.update",
  "activity_logs.view",
  "referral.view",
] as const;

export const SUPER_ADMIN_PERMISSIONS = [
  "dashboard.view",
  "company.view",
  "company.create",
  "company.update",
  "company.delete",
  "plan.view",
  "plan.create",
  "plan.update",
  "plan.delete",
  "plan_request.view",
  "plan_request.create",
  "plan_request.approve",
  "plan_request.reject",
  "plan_request.update",
  "plan_request.delete",
  "referral.view",
  "referral.create",
  "referral.update",
  "referral.delete",
  "coupon.view",
  "coupon.create",
  "coupon.update",
  "coupon.delete",
  "order.view",
  "order.create",
  "order.update",
  "order.cancel",
  "order.delete",
  "email_template.view",
  "email_template.create",
  "email_template.update",
  "email_template.delete",
  "property.view",
  "property.create",
  "property.update",
  "property.delete",
  "service.view",
  "service.create",
  "service.update",
  "service.delete",
  "user.view",
  "user.create",
  "user.update",
  "user.delete",
  "settings.view",
  "settings.update",
  "activity_logs.view",
  "referral.view",
  "permission.view",
  "permission.manage",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];
export type SuperAdminPermission = (typeof SUPER_ADMIN_PERMISSIONS)[number];
export type PlatformPermission = AdminPermission | SuperAdminPermission;

export const PERMISSION_LABELS: Record<PlatformPermission, string> = {
  "dashboard.view": "View Dashboard",
  "property.view": "View Properties",
  "property.create": "Create Properties",
  "property.update": "Update Properties",
  "property.delete": "Delete Properties",
  "service.view": "View Services",
  "service.create": "Create Services",
  "service.update": "Update Services",
  "service.delete": "Delete Services",
  "user.view": "View Users",
  "user.create": "Create Users",
  "user.update": "Update Users",
  "user.delete": "Delete Users",
  "settings.view": "View Settings",
  "settings.update": "Update Settings",
  "activity_logs.view": "View Activity Logs",
  "referral.view": "View Referral Programs",
  "order.view": "View Orders",
  "order.create": "Create Orders",
  "order.update": "Update Orders",
  "order.cancel": "Cancel Orders",
  "order.delete": "Delete Orders",
  "plan_request.view": "View Plan Requests",
  "plan_request.create": "Create Plan Requests",
  "plan_request.approve": "Approve Plan Requests",
  "plan_request.reject": "Reject Plan Requests",
  "plan_request.update": "Update Plan Requests",
  "plan_request.delete": "Delete Plan Requests",
  "coupon.view": "View Coupons",
  "coupon.create": "Create Coupons",
  "coupon.update": "Update Coupons",
  "coupon.delete": "Delete Coupons",
  "company.view": "View Companies",
  "company.create": "Create Companies",
  "company.update": "Update Companies",
  "company.delete": "Delete Companies",
  "plan.view": "View Plans",
  "plan.create": "Create Plans",
  "plan.update": "Update Plans",
  "plan.delete": "Delete Plans",
  "referral.create": "Create Referral Programs",
  "referral.update": "Update Referral Programs",
  "referral.delete": "Delete Referral Programs",
  "email_template.view": "View Email Templates",
  "email_template.create": "Create Email Templates",
  "email_template.update": "Update Email Templates",
  "email_template.delete": "Delete Email Templates",
  "permission.view": "View Permissions",
  "permission.manage": "Manage Permissions",
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

// `Staff` is a superset used by admin tables and lists. Keep fields optional
// when they are not part of the core `StaffMember` shape.
export type Staff = StaffMember & {
  display_name?: string;
  organization_id?: string | null;
  mobile_number?: string | null;
  roles?: string[];
  email_verified_at?: string | null;
  mobile_verified_at?: string | null;
  updated_at?: string | null;
};

export type GetStaffParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};
