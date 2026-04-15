import type { ServiceGroup } from "./service_group.types";

type ServiceGroupApi = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  organization_type?: {
    id: string;
    name: string;
    slug: string;
  };
  services_count?: number;
  organization_count?: number;
  created_at?: string;
  updated_at?: string;
};

export const mapServiceGroup = (item: ServiceGroupApi): ServiceGroup => ({
  id: item.id,
  name: item.name ?? null,
  slug: item.slug ?? null,
  description: item.description ?? null,
  organization_type: item.organization_type ?? null,
  services_count: item.services_count ?? undefined,
  organization_count: item.organization_count ?? undefined,
  created_at: item.created_at ?? null,
  updated_at: item.updated_at ?? null,
});
