export type PlanFeature = {
  name: string;
  enabled: boolean;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  propertyLimit: number;
  popular: boolean;
  features: PlanFeature[];
  created_at?: string;
};

export type PlanFormValues = {
  name: string;
  price: number;
  propertyLimit: number;
  popular: boolean;
  features: PlanFeature[];
};

// Starter features shown for new plans — fully editable/removable
export const DEFAULT_FEATURES: string[] = [
  "Property Listings",
  "Featured Listings",
  "Agent Profiles",
  "Advanced Analytics",
  "Priority Support",
  "CRM Integration",
  "Lead Management",
  "Custom Branding",
];

export const ALL_FEATURES = DEFAULT_FEATURES;
