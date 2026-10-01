import api from "../clients.api";

export type PublicPlan = {
  id: string;
  name: string;
  plan_family: string;
  description?: string | null;
  monthly_price?: number | null;
  yearly_price?: number | null;
  currency?: string;
  show_price?: boolean;
  popular?: boolean;
  features: { name: string; enabled: boolean; value: number | null }[];
};

export const getPublicPlans = async (): Promise<PublicPlan[]> => {
  const response = await api.get<{ data: PublicPlan[] }>("/plans/public");
  return response.data.data ?? [];
};

export type PricingInquiryPayload = {
  plan_id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  message: string;
};

export const createPricingInquiry = async (payload: PricingInquiryPayload) => {
  const response = await api.post('/pricing-inquiries', payload);
  return response.data;
};
