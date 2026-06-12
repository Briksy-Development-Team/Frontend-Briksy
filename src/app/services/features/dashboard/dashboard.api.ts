import axiosInstance from "../../api/axiosInstance";

export type DashboardSummary = {
  total_companies: number;
  active_plans: number;
  total_orders: number;
  plan_requests: number;
  property_summary: {
    total: number;
    published: number;
    draft: number;
    archived: number;
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
};

type DashboardEnvelope = {
  success: boolean;
  message: string;
  data: DashboardSummary;
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await axiosInstance.get<DashboardEnvelope>("/super-admin/dashboard");
  return response.data.data;
};
