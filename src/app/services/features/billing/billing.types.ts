export type BillingCycle = "monthly" | "yearly";

export type Addon = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  feature_key: string;
  pricing_type: "one_time" | "monthly" | "yearly" | "usage_based";
  monthly_price?: number | null;
  yearly_price?: number | null;
  one_time_price?: number | null;
  currency: string;
  limits?: Record<string, unknown> | null;
  is_active: boolean;
  sort_order: number;
  pivot?: {
    included_quantity?: number | null;
    is_included?: boolean;
  };
};

export type DynamicIdSetting = {
  id: string;
  entity_type: string;
  prefix?: string | null;
  separator?: string | null;
  include_year: boolean;
  include_month: boolean;
  number_padding: number;
  starting_number: number;
  current_number: number;
  reset_frequency: "none" | "monthly" | "yearly";
  last_reset_at?: string | null;
  is_active: boolean;
  sample_preview?: string;
};

export type SubscriptionAddon = {
  id: string;
  addon_id: string;
  quantity: number;
  amount: number;
  billing_cycle: BillingCycle | "one_time" | "usage_based";
  stripe_price_id?: string | null;
  addon?: Addon | null;
};

export type SubscriptionPlanBilling = {
  id: string;
  name: string;
  description?: string | null;
  monthly_price?: number | null;
  yearly_price?: number | null;
  currency: string;
  billing_enabled?: boolean;
  trial_days?: number | null;
  is_active?: boolean;
  popular?: boolean;
  addons?: Addon[];
};

export type BillingCheckoutAddonSelection = {
  addon_id: string;
  quantity?: number;
};

export type CompanySubscription = {
  id: string;
  organization_id: string;
  company?: { id: string; name: string; slug?: string } | null;
  plan?: SubscriptionPlanBilling | null;
  billing_cycle: BillingCycle;
  status: string;
  currency: string;
  amount?: number | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_checkout_session_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  canceled_at?: string | null;
  payment_status?: string | null;
  addons?: SubscriptionAddon[];
  created_at?: string;
  updated_at?: string;
};

export type BillingCheckoutResponse = {
  checkout_session_id?: string;
  checkout_url?: string | null;
};
