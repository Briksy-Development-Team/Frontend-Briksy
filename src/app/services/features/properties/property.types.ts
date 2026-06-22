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

  status: "Draft" | "Published" | "Archived";

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

  created_at?: string | null;
  updated_at?: string | null;
};

export type PropertyFormValues = {
  title: string;
  description?: string;

  status: "Draft" | "Published" | "Archived";

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
  property_type_id?: string;

  images?: (File | string)[];
  videos?: (File | string)[];
};

export type PropertyList = {
  id: string;

  title: string;

  status: "Draft" | "Published" | "Archived";

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
