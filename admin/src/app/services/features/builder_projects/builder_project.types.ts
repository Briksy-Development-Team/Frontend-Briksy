export type BuilderProjectMedia = {
  id?: string;
  url: string;
  is_primary?: boolean;
  sort_order?: number;
};

export type BuilderProject = {
  id: string;
  display_id?: string | null;
  name: string;
  project_type?: string | null;
  status: string;
  location?: string | null;
  state?: string | null;
  postcode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  images?: BuilderProjectMedia[];
  videos?: BuilderProjectMedia[];
  features?: string[];
  submitted_at?: string | null;
  reviewed_at?: string | null;
  published_at?: string | null;
  created_at?: string | null;
};
