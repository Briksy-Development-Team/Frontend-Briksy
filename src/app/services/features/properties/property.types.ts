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
  filters?: Record<string, any>;
};
