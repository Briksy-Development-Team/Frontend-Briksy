export type PropertyImage = {
  id?: string;
  url: string;
};

export type PropertyVideo = {
  id?: string;
  url: string;
};

export type Property = {
  id: string;

  title: string;
  description?: string | null;

  status: "Draft" | "Pending Review" | "Approved" | "Rejected" | "Published" | "Archived";

  address?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  full_address?: string | null;
  formatted_address?: string | null;
  place_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  location_verified?: boolean;
  submitted_at?: string | null;
  reviewed_by?: string | null;
  reviewer?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  published_at?: string | null;
  location_verified_by?: string | null;
  location_verifier?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  location_verified_at?: string | null;
  property_type_id?: string | null;
  property_type?: {
    id: string;
    name: string;
    slug?: string;
  } | null;

  rating?: number;

  images?: PropertyImage[];
  videos?: PropertyVideo[];

  organization?: {
    id: string;
    name: string;
    slug?: string;
    is_verified?: boolean;
  } | null;

  creator?: {
    id: string;
    name: string;
    email?: string;
  } | null;

  timeline_events?: Array<{
    id: string;
    action?: string | null;
    title?: string | null;
    description?: string | null;
    comment?: string | null;
    user_name?: string | null;
    user_role?: string | null;
    created_at?: string | null;
  }>;

  created_at?: string | null;
  updated_at?: string | null;
};

export type PropertyFormValues = {
  title: string;
  description?: string;

  status: "Draft" | "Pending Review" | "Approved" | "Rejected" | "Published" | "Archived";

  address?: string;
  address_line_1?: string;
  address_line_2?: string;
  full_address?: string;
  formatted_address?: string;
  place_id?: string;
  latitude?: string | number;
  longitude?: string | number;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  location_verified?: boolean;
  submitted_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  published_at?: string;
  location_verified_by?: string;
  location_verified_at?: string;
  property_type_id?: string;

  images?: (File | string)[];
  videos?: (File | string)[];
};

export type PropertyList = {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;

  title: string;

  status: "Draft" | "Pending Review" | "Approved" | "Rejected" | "Published" | "Archived";

  description?: string | null;

  rating?: number;

  address?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  full_address?: string | null;
  formatted_address?: string | null;
  place_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  location_verified?: boolean;
  submitted_at?: string | null;
  reviewed_by?: string | null;
  reviewer?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  published_at?: string | null;
  location_verified_by?: string | null;
  location_verifier?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  location_verified_at?: string | null;
  property_type_id?: string | null;
  property_type?: {
    id: string;
    name: string;
    slug?: string;
  } | null;

  organization?: {
    id: string;
    name: string;
    slug?: string;
    is_verified?: boolean;
  } | null;

  creator?: {
    id: string;
    name: string;
    email?: string;
  } | null;

  timeline_events?: Array<{
    id: string;
    action?: string | null;
    title?: string | null;
    description?: string | null;
    comment?: string | null;
    user_name?: string | null;
    user_role?: string | null;
    created_at?: string | null;
  }>;

  created_at?: string | null;
  updated_at?: string | null;
};

export type PropertyListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, unknown>;
};
