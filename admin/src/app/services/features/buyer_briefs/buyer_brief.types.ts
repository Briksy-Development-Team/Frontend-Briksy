export type BuyerBrief = {
  id: string;
  client_name: string;
  client_email?: string | null;
  status?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferred_locations?: string[] | null;
  preferences?: Record<string, unknown> | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BuyerBriefFormValues = {
  client_name: string;
  client_email: string;
  status: string;
  budget_min: string;
  budget_max: string;
  preferred_locations: string;
  bedrooms: string;
  property_type: string;
  notes: string;
};
