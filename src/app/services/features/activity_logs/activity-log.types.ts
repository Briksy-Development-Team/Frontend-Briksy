export type ActivityLogOrganization = {
  id: string;
  name: string;
  slug?: string;
};

export type ActivityLog = {
  id: string;
  organization_id: string | null;
  organization?: ActivityLogOrganization | null;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_role: string | null;
  action: string;
  module: string | null;
  description: string | null;
  method: string | null;
  route: string | null;
  ip_address: string | null;
  user_agent: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type ActivityLogListResponse = {
  data: ActivityLog[];
  total: number;
};

export type ActivityLogQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};
