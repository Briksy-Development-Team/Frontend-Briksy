import type { Organization } from "./organization.types";

type OrganizationApi = {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  abn?: string;
  acn?: string;
  business_type?: string;
  business_verification_status?: string;
  is_verified: boolean;
  avg_org_rating?: string;
  logo_url?: string;
  licensed_staff_seats?: number;
  plan_id?: string;
  ranking_priority?: number;
  pending_properties_count?: number;
  slug?: string;
  stripe_customer_id?: string;
  brand_primary_color?: string;
  brand_secondary_color?: string;
  address?: string;
  created_at?: string;
  state?: string;
  postcode?: string;
  type?: {
    id: string;
    name: string;
    slug: string;
  };
};

export const mapOrganization = (item: OrganizationApi): Organization => ({
  id: item.id,
  generated_id: item.generated_id ?? null,
  display_id: item.display_id ?? item.generated_id ?? null,
  name: item.name ?? "",
  slug: item.slug ?? undefined,
  abn: item.abn ?? undefined,
  acn: item.acn ?? undefined,
  business_type: item.business_type ?? undefined,
  business_verification_status: item.business_verification_status ?? undefined,
  is_verified: Boolean(item.is_verified),
  avg_org_rating: item.avg_org_rating ?? undefined, // ← keep as string, don't convert to Number
  logo_url: item.logo_url ?? undefined,
  licensed_staff_seats: item.licensed_staff_seats ?? undefined,
  plan_id: item.plan_id ?? null,
  ranking_priority: item.ranking_priority ?? undefined,
  pending_properties_count: item.pending_properties_count ?? 0,
  stripe_customer_id: item.stripe_customer_id ?? null,
  brand_primary_color: item.brand_primary_color ?? undefined,
  brand_secondary_color: item.brand_secondary_color ?? undefined,
  address: item.address ?? undefined,
  contact_email: item.contact_email ?? undefined,
  contact_phone: item.contact_phone ?? undefined,
  created_at: item.created_at ?? undefined,
  state: item.state ?? undefined,
  postcode: item.postcode ?? undefined,
  type: item.type ?? undefined, // ← was missing entirely
});
