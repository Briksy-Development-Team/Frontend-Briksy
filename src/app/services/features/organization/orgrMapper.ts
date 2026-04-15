import type { Organization } from "./orgr.types";

type OrganizationApi = {
  id: string;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  abn?: string;
  acn?: string;
  is_verified: boolean;
  avg_org_rating?: string;
  logo_url?: string;
  licensed_staff_seats?: number;
  plan_id?: string;
  ranking_priority?: number;
  slug?: string;
  stripe_customer_id?: string;
  brand_primary_color?: string;
  brand_secondary_color?: string;
  created_at?: string;
  type?: {
    id: string;
    name: string;
    slug: string;
  };
};

export const mapOrganization = (item: OrganizationApi): Organization => ({
  id: item.id,
  name: item.name ?? "",
  slug: item.slug ?? undefined,
  abn: item.abn ?? undefined,
  acn: item.acn ?? undefined,
  is_verified: Boolean(item.is_verified),
  avg_org_rating: item.avg_org_rating ?? undefined, // ← keep as string, don't convert to Number
  logo_url: item.logo_url ?? undefined,
  licensed_staff_seats: item.licensed_staff_seats ?? undefined,
  plan_id: item.plan_id ?? null,
  ranking_priority: item.ranking_priority ?? undefined,
  stripe_customer_id: item.stripe_customer_id ?? null,
  brand_primary_color: item.brand_primary_color ?? undefined,
  brand_secondary_color: item.brand_secondary_color ?? undefined,
  contact_email: item.contact_email ?? undefined,
  contact_phone: item.contact_phone ?? undefined,
  created_at: item.created_at ?? undefined,
  type: item.type ?? undefined, // ← was missing entirely
});
