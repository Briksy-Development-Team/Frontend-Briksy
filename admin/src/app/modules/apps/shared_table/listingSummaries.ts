import type { ListingSummary } from "./hooks/useListingSummary";

const active = [
  { label: "Active", value: "1" },
  { label: "Inactive", value: "0" },
];
const verification = [
  { label: "Verified", value: "verified" },
  { label: "Pending verification", value: "pending" },
  { label: "Rejected", value: "rejected" },
];
const publication = [
  { label: "Published", value: "Published" },
  { label: "Pending", value: "Pending Review" },
  { label: "Rejected", value: "Rejected" },
];

const summary = (resource: string, filterKey: string, options: NonNullable<ListingSummary["options"]>): ListingSummary =>
  ({ endpoint: `/super-admin/${resource}`, filterKey, options });

export const listingSummaries = {
  property: summary("properties", "status", publication),
  propertyApprovals: { endpoint: "/super-admin/properties", resetKeys: ["verified_only", "listing_purpose", "transaction_status", "state", "suburb", "postcode", "property_type_id"] },
  projects: summary("builder-projects", "status", publication),
  organizations: summary("organizations", "business_verification_status", verification),
  services: summary("services", "is_active", active),
  propertyOffers: summary("property-offers", "is_active", active),
  serviceOffers: summary("service-offers", "is_active", active),
  addons: summary("addons", "is_active", active),
  emailTemplates: summary("email-templates", "is_active", active),
  categories: summary("service-categories", "is_active", active),
  agentTypes: summary("organization-types", "is_active", active),
  coupons: summary("coupons", "status", ["active", "inactive", "expired"]),
  planRequests: summary("plan-requests", "status", ["pending", "approved", "rejected", "cancelled"]),
  inquiries: summary("inquiries", "status", ["new", "contacted", "in_discussion", "checkout_sent", "payment_pending", "paid", "closed", "expired"]),
  orders: summary("orders", "order_status", ["draft", "confirmed", "active", "expired", "cancelled"]),
  staff: { endpoint: "/super-admin/staff", resetKeys: ["organization_id", "roles", "created_at"] },
  seekers: summary("seekers", "email_verified", [
    { label: "Email verified", value: "1" },
    { label: "Email unverified", value: "0" },
  ]),
};
