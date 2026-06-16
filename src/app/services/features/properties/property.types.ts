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
  suburb?: string | null;
  postcode?: string | null;

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
  suburb?: string;
  postcode?: string;

  images?: (File | string)[];
  videos?: (File | string)[];
};

export type PropertyList = {
  id: string;

  title: string;

  status: "Draft" | "Published" | "Archived";

  description?: string | null;

  rating?: number;

  suburb?: string | null;

  postcode?: string | null;

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
