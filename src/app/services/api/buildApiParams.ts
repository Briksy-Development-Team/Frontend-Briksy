export const API_ROUTES = {
  superAdmin: {
    organizations: "/super-admin/organizations",
    staff: "/super-admin/staff",
    properties: "/super-admin/properties",
    services: "/super-admin/services",
    plans: "/super-admin/plans",
    coupons: "/super-admin/coupons",
    orders: "/super-admin/orders",
    emailTemplates: "/super-admin/email-templates",
  },

  admin: {
    staff: "/admin/staff",
    properties: "/admin/properties",
    services: "/admin/services",
  },

  staff: {
    properties: "/staff/properties",
    services: "/staff/services",
  },
};