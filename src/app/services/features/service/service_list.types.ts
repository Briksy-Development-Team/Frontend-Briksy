export type ServiceCategory =
  | "electrical"
  | "plumbing"
  | "fencing"
  | "landscapers"
  | "conveyancers"
  | "brokers";

export type Service = {
  id: string;

  name: string;

  slug?: string | null;

  description?: string | null;

  category?: ServiceCategory;

  image?: string | null;

  created_at?: string | null;

  updated_at?: string | null;
};

export type ServiceList = {
  id: string;

  name: string;

  slug?: string | null;

  description?: string | null;

  category?: ServiceCategory;

  image?: string | null;

  organization_type?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  services_count?: number;

  organization_count?: number;

  created_at?: string | null;

  updated_at?: string | null;
};

export type ServiceFormValues = {
  name: string;

  slug?: string;

  description?: string;

  category: ServiceCategory;

  image?: File | string | null;
};

export type GetServiceListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, unknown>;
};
