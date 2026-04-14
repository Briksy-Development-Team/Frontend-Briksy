export type Staff = {
  id: string;

  name: string;
  display_name?: string;

  email: string;
  mobile_number?: string;

  organization_id?: string;

  roles: string[];

  email_verified_at?: string | null;
  mobile_verified_at?: string | null;

  created_at?: string;  
};

export type GetStaffParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  filters?: Record<string, any>;
};
