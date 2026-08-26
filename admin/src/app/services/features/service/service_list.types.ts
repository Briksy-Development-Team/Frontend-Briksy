import type { ServiceAreaGeometry } from "./serviceAreaGeometry";

export type ServiceCategory =
  | "electrical"
  | "plumbing"
  | "fencing"
  | "landscapers"
  | "conveyancers"
  | "brokers";

export type Service = {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;

  name: string;

  slug?: string | null;

  title?: string | null;

  description?: string | null;

  category?: ServiceCategory;

  service_area?: string | null;

  service_area_geometry?: ServiceAreaGeometry | null;

  rate_from?: number | null;

  rate_to?: number | null;

  is_active?: boolean;

  image?: string | null;

  created_at?: string | null;

  updated_at?: string | null;
};

export type ServiceList = {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;

  name: string;

  slug?: string | null;

  title?: string | null;

  description?: string | null;

  category?: ServiceCategory;

  service_area?: string | null;

  service_area_geometry?: ServiceAreaGeometry | null;

  rate_from?: number | null;

  rate_to?: number | null;

  is_active?: boolean;

  image?: string | null;

  organization_type?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  organization_count?: number;

  service_group_count?: number;

  created_at?: string | null;

  updated_at?: string | null;
};

export type ServiceFormValues = {
  name: string;

  slug?: string;

  description?: string;

  category: ServiceCategory;

  service_area?: string;

  service_area_geometry?: ServiceAreaGeometry | null;

  rate_from?: string | number;

  rate_to?: string | number;

  is_active?: boolean;

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
