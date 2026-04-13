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
  created_at?: string;
};

export const mapOrganization = (item: OrganizationApi) => ({
  id: item.id,

  name: item.name ?? null,

  contact_email: item.contact_email ?? null,
  contact_phone: item.contact_phone ?? null,

  abn: item.abn ?? null,
  acn: item.acn ?? null,

  is_verified: Boolean(item.is_verified),

  avg_org_rating: item.avg_org_rating ? Number(item.avg_org_rating) : null,

  logo_url: item.logo_url ?? null,

  licensed_staff_seats: item.licensed_staff_seats ?? 0,

  plan_id: item.plan_id ?? null,

  ranking_priority: item.ranking_priority ?? 0,

  slug: item.slug ?? null,

  stripe_customer_id: item.stripe_customer_id ?? null,

  created_at: item.created_at ?? null,
});
