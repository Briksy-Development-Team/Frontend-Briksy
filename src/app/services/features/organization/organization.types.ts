export type Organization = {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;
  name: string;
  slug?: string;
  abn?: string;
  acn?: string;
  business_type?: string;
  business_verification_status?: string;
  avg_org_rating?: string;
  brand_primary_color?: string;
  brand_secondary_color?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  is_verified?: boolean;
  licensed_staff_seats?: number;
  logo_url?: string;
  plan_id?: string | null;
  ranking_priority?: number;
  pending_properties_count?: number;
  stripe_customer_id?: string | null;
  state?: string;
  postcode?: string;
  type?: {
    id: string;
    name: string;
    slug: string;
  };
};

export type OrganizationFormValues = {
  name: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  business_type?: "organisation" | "company" | "solo_trader";
  business_verification_status?: "pending" | "verified" | "rejected";
  abn?: string;
  acn?: string;
  is_verified?: boolean;
};

export type GetOrganizationParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};
