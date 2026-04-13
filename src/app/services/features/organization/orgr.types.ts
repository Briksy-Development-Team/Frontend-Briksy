export type Organization = {
  id: string;

  name: string | null;

  contact_email?: string | null;
  contact_phone?: string | null;

  abn?: string | null;
  acn?: string | null;

  is_verified: boolean;

  avg_org_rating?: number | null;

  logo_url?: string | null;

  licensed_staff_seats?: number;

  plan_id?: string | null;

  ranking_priority?: number;

  slug?: string | null;

  stripe_customer_id?: string | null;

  created_at?: string | null;
};

export type GetOrganizationParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
};
