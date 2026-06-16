export type PlanFeature = {
  name: string;
  enabled: boolean;
  value?: number | null; 
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  popular: boolean;
  features: PlanFeature[];
  is_current?: boolean;
  created_at?: string;
};

export type PlanFormValues = {
  name: string;
  price: number;
  popular: boolean;
  features: PlanFeature[];
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
