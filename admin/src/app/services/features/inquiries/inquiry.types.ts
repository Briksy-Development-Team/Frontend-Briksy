export type Inquiry = {
  id: string;
  reference_no?: string | null;
  display_id?: string | null;
  lead_source?: string | null;
  status: string;
  subject?: string | null;
  message?: string | null;
  seeker_name?: string | null;
  seeker_email?: string | null;
  seeker_phone?: string | null;
  property_listing_id?: string | null;
  property_title?: string | null;
  property_address?: string | null;
  organization_id?: string | null;
  organization_name?: string | null;
  created_at?: string;
  updated_at?: string;
};
