import axiosInstance from "../../api/axiosInstance";

export type CheckoutInvitation = {
  checkout_url: string;
  status: string;
  plan?: { id: string; name: string; billing_cycle: string } | null;
  customer?: { name?: string | null; email?: string | null; company_name?: string | null };
  created_at?: string;
  expires_at?: string;
  paid_at?: string | null;
  email_sent?: boolean;
};

export const createCheckoutInvitationApi = async (inquiryId: string, planId: string, billingCycle: string): Promise<CheckoutInvitation> => {
  const response = await axiosInstance.post<{ data: CheckoutInvitation }>(`/super-admin/inquiries/${inquiryId}/checkout-link`, { plan_id: planId, billing_cycle: billingCycle });
  return response.data.data;
};
