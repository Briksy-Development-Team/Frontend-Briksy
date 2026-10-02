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
  addons?: PublicAddon[];
};

export type PublicAddon = {
  id: string;
  name: string;
  description?: string | null;
  pricing_type: string;
  monthly_price?: number | null;
  yearly_price?: number | null;
  one_time_price?: number | null;
  currency?: string;
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

export type DirectCheckoutPayload = {
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
  name: string;
  email: string;
  phone: string;
  company_name: string;
  business_type: string;
  abn_number: string;
  address: string;
  state: string;
  postcode: string;
  password: string;
  password_confirmation: string;
  addons: { addon_id: string; quantity: number }[];
};

export const createDirectCheckout = async (payload: DirectCheckoutPayload) => {
  const response = await api.post<{ data: { checkout_url: string } }>('/checkout', payload);
  return response.data.data;
};
