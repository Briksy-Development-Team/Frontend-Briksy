import type { Seeker } from "./seeker.types";

type SeekerApi = {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;
  name: string;
  display_name?: string;
  email: string;
  mobile_number?: string;
  organization_id?: string;
  roles?: string[];
  email_verified_at?: string | null;
  mobile_verified_at?: string | null;
  created_at?: string;
};

export const mapSeeker = (item: SeekerApi): Seeker => ({
  id: item.id,
  generated_id: item.generated_id ?? null,
  display_id: item.display_id ?? item.generated_id ?? item.id,
  name: item.name,
  display_name: item.display_name,
  email: item.email,
  mobile_number: item.mobile_number,
  organization_id: item.organization_id,
  roles: Array.isArray(item.roles) ? item.roles : [],
  email_verified_at: item.email_verified_at ?? null,
  mobile_verified_at: item.mobile_verified_at ?? null,
  created_at: item.created_at,
});
