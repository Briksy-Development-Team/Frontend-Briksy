export type PlanRequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export type PlanRequest = {
  id: string;
  organization_id?: string | null;
  requested_by?: string | null;
  plan_id?: string | null;
  company_name?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  requested_plan_name?: string | null;
  billing_cycle?: string | null;
  message?: string | null;
  status: PlanRequestStatus;
  admin_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  organization?: { id: string; name: string };
  plan?: { id: string; name: string; price?: number };
};

export type PlanRequestFormValues = {
  organization_id?: string | null;
  plan_id?: string | null;
  company_name?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  requested_plan_name?: string | null;
  billing_cycle?: string | null;
  message?: string | null;
  admin_notes?: string | null;
};

export type PlanRequestReviewValues = {
  admin_notes?: string | null;
  create_order?: boolean;
  plan_id?: string | null;
  organization_id?: string | null;
};
