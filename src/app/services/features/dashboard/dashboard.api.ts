import axiosInstance from "../../api/axiosInstance";
import { buildApiParams } from "../../utils/buildApiParams";

export type DashboardFilters = {
  date_from?: string;
  date_to?: string;
  role?: string;
  agent_id?: string;
  organization_id?: string;
};

export type SuperAdminDashboardSummary = {
  total_companies: number;
  active_plans: number;
  total_orders: number;
  plan_requests: number;
  active_subscriptions: number;
  revenue_this_month: number;
  property_summary: {
    total: number;
    draft?: number;
    pending_review?: number;
    approved?: number;
    rejected?: number;
    published: number;
    archived: number;
    awaiting_location_verification?: number;
    published_today?: number;
  };
  recent_companies: Array<{
    id: string;
    name: string;
    created_at?: string | null;
  }>;
  recent_properties: Array<{
    id: string;
    title: string;
    status: string;
    created_at?: string | null;
  }>;
  trend_series: Array<{
    label: string;
    companies: number;
    properties: number;
    subscriptions: number;
    revenue: number;
    company_conversion_rate: number;
  }>;
  lead_source_funnel: Array<{
    label: string;
    value: number;
    share: number;
  }>;
  lead_funnel: Array<{
    stage: string;
    value: number;
  }>;
  monthly_pipeline: Array<{
    label: string;
    inquiries: number;
    orders: number;
    revenue: number;
    close_rate: number;
  }>;
  agent_leaderboard: Array<{
    id: string;
    name: string;
    role?: string | null;
    organization?: string | null;
    properties: number;
    inquiries: number;
    orders: number;
    revenue: number;
    conversion_rate: number;
  }>;
};

export type AdminDashboardSummary = {
  organization: {
    id: string;
    name: string;
    trading_name?: string | null;
    referral_code?: string | null;
    status?: string | null;
  };
  current_subscription: {
    id: string;
    plan_name?: string | null;
    billing_cycle?: string | null;
    status?: string | null;
    amount?: number | null;
    currency?: string | null;
    current_period_end?: string | null;
  } | null;
  metrics: {
    team_members: number;
    properties: number;
    published_properties: number;
    draft_properties?: number;
    pending_review_properties?: number;
    approved_properties?: number;
    rejected_properties?: number;
    archived_properties?: number;
    services: number;
    inquiries: number;
    new_inquiries: number;
    orders: number;
    active_orders: number;
    revenue: number;
    revenue_this_month: number;
    average_order_value: number;
    referrals: number;
  };
  lead_conversion_rate: number;
  trend_series: Array<{
    label: string;
    properties: number;
    inquiries: number;
    orders: number;
    revenue: number;
    lead_conversion_rate: number;
  }>;
  lead_source_funnel: Array<{
    label: string;
    value: number;
    share: number;
  }>;
  lead_funnel: Array<{
    stage: string;
    value: number;
  }>;
  monthly_pipeline: Array<{
    label: string;
    inquiries: number;
    orders: number;
    revenue: number;
    close_rate: number;
  }>;
  agent_leaderboard: Array<{
    id: string;
    name: string;
    role?: string | null;
    properties: number;
    inquiries: number;
    orders: number;
    revenue: number;
    conversion_rate: number;
  }>;
  recent_properties: Array<{
    id: string;
    title: string;
    status: string;
    created_at?: string | null;
  }>;
  recent_inquiries: Array<{
    id: string;
    subject?: string | null;
    status?: string | null;
    created_at?: string | null;
  }>;
  recent_orders: Array<{
    id: string;
    reference_no?: string | null;
    order_status?: string | null;
    payment_status?: string | null;
    total_amount?: number | null;
    created_at?: string | null;
  }>;
};

type DashboardEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const fetchSuperAdminDashboardSummary = async (filters: DashboardFilters = {}): Promise<SuperAdminDashboardSummary> => {
  const response = await axiosInstance.get<DashboardEnvelope<SuperAdminDashboardSummary>>("/super-admin/dashboard", {
    params: buildApiParams({ filters }),
  });
  return response.data.data;
};

export const fetchAdminDashboardSummary = async (filters: DashboardFilters = {}): Promise<AdminDashboardSummary> => {
  const response = await axiosInstance.get<DashboardEnvelope<AdminDashboardSummary>>("/admin/dashboard", {
    params: buildApiParams({ filters }),
  });
  return response.data.data;
};

export const fetchDashboardSummary = fetchSuperAdminDashboardSummary;
