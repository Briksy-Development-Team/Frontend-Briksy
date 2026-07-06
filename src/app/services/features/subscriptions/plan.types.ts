export type PlanFeature = {
  name: string;
  enabled: boolean;
  value?: number | null;
};

export type PlanPermission = {
  id: string;
  name: string;
  display_name?: string | null;
  module: string;
  action: string;
};

export type PlanSubscriptionSummary = {
  status: "trialing" | "active" | "expired" | "inactive";
  is_trial_active: boolean;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  subscription_activated_at?: string | null;
  plan?: {
    id: string;
    name: string;
    price: number;
  } | null;
  current_subscription?: {
    id: string;
    status: string;
    current_period_start?: string | null;
    current_period_end?: string | null;
  } | null;
};

export type Plan = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  monthly_price?: number | null;
  yearly_price?: number | null;
  currency?: string;
  billing_enabled?: boolean;
  trial_days?: number | null;
  popular: boolean;
  features: PlanFeature[];
  permissions?: string[];
  addons?: Array<{
    id: string;
    name: string;
    slug: string;
    feature_key: string;
    pricing_type: string;
    monthly_price?: number | null;
    yearly_price?: number | null;
    one_time_price?: number | null;
    currency?: string;
    is_active?: boolean;
    pivot?: { included_quantity?: number | null; is_included?: boolean };
  }>;
  is_current?: boolean;
  is_active?: boolean;
  propertyLimit?: number;
  staff_seat_limit?: number;
  has_visitor_analytics?: boolean;
  ranking_priority?: number;
  created_at?: string;
};

export type PlanFormValues = {
  name: string;
  description?: string | null;
  price: number;
  monthly_price?: number | null;
  yearly_price?: number | null;
  currency?: string;
  billing_enabled?: boolean;
  trial_days?: number | null;
  propertyLimit: number;
  popular: boolean;
  features: PlanFeature[];
  permissions: string[];
  addon_ids?: string[];
  is_active?: boolean;
};

export const DEFAULT_FEATURES: { name: string; numeric?: boolean }[] = [
  { name: "Properties", numeric: true },
  { name: "Services", numeric: true },
  { name: "Staff Seats", numeric: true },
  { name: "Featured Listings" },
  { name: "Agent Profiles" },
  { name: "Advanced Analytics" },
  { name: "Priority Support" },
  { name: "CRM Integration" },
  { name: "Lead Management" },
  { name: "Custom Branding" },
];
