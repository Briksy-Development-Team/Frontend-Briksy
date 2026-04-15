export type Organization = {
  id: string;
  name: string;
  slug?: string;
  abn?: string;
  acn?: string;
  avg_org_rating?: string;
  brand_primary_color?: string;
  brand_secondary_color?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  is_verified?: boolean;
  licensed_staff_seats?: number;
  logo_url?: string;
  plan_id?: string | null;
  ranking_priority?: number;
  stripe_customer_id?: string | null;
  type?: {
    id: string;
    name: string;
    slug: string;
  };
};
export type GetOrganizationParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};
