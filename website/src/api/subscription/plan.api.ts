import api from "../clients.api";

export type PublicPlan = {
  id: string;
  name: string;
  plan_family: string;
  description?: string | null;
  monthly_price?: number | null;
  yearly_price?: number | null;
  currency?: string;
  popular?: boolean;
  features: { name: string; enabled: boolean; value: number | null }[];
};

export const getPublicPlans = async (): Promise<PublicPlan[]> => {
  const response = await api.get<{ data: PublicPlan[] }>("/plans/public");
  return response.data.data ?? [];
};
