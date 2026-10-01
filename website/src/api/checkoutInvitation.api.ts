import api from './clients.api';

export type CheckoutInvitation = {
  token: string;
  expires_at: string;
  status: string;
  plan: { id: string; name: string; description?: string | null; monthly_price: number; yearly_price: number | null; currency: string; billing_cycle: string; features?: { name: string; enabled: boolean; value?: number | null }[] };
  customer: { name?: string | null; email?: string | null; phone?: string | null; company_name?: string | null };
};

export const getCheckoutInvitation = async (token: string): Promise<CheckoutInvitation> => {
  const response = await api.get<{ data: CheckoutInvitation }>(`/checkout/${encodeURIComponent(token)}`);
  return response.data.data;
};

export const payCheckoutInvitation = async (token: string, payload: Record<string, string>) => {
  const response = await api.post<{ data: { checkout_url: string } }>(`/checkout/${encodeURIComponent(token)}/payment`, payload);
  return response.data.data;
};
