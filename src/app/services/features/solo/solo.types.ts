export type Solo = {
  id: number;
  name: string;
  email: string;
  status?: string;
  last_login?: string;
  current_login?: string;

  location?: string;
  created_at?: string;
  updated_at?: string;
};

export type GetSoloParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};
