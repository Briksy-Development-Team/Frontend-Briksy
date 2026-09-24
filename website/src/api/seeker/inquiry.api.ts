import api from "../clients.api";

export type CreateInquiryPayload = {
  organization_id: string;
  property_listing_id?: string | null;
  staff_id?: string | null;
  lead_source?: string | null;
  subject: string;
  message: string;
  seeker_name?: string | null;
  seeker_email?: string | null;
  seeker_phone?: string | null;
};

export type CreateInquiryResponse = {
  success: boolean;
  message: string;
  data?: {
    reference_no?: string;
    display_id?: string;
    email_delivery?: { status?: string };
  };
};

export const createInquiry = async (payload: CreateInquiryPayload): Promise<CreateInquiryResponse> => {
  const response = await api.post("/seeker/inquiries", payload);

  return response.data;
};
