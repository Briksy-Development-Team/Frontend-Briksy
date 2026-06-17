import type {
  Service,
  ServiceList,
  ServiceCategory,
} from "./service_list.types";

type ServiceApi = {
  id: string;

  name: string;

  slug?: string;

  description?: string;

  category?: ServiceCategory;

  image?: string;

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

export const mapServiceList = (item: ServiceApi): ServiceList => ({
  id: item.id,

  name: item.name ?? "",

  slug: item.slug ?? null,

  description: item.description ?? null,

  category: item.category,

  image: item.image ?? null,

  organization_type: item.organization_type ?? null,

  services_count: item.services_count ?? 0,

  organization_count: item.organization_count ?? 0,

  created_at: item.created_at ?? null,

  updated_at: item.updated_at ?? null,
});

export const mapService = (item: ServiceApi): Service => ({
  id: item.id,

  name: item.name ?? "",

  slug: item.slug ?? null,

  description: item.description ?? null,

  category: item.category,

  image: item.image ?? null,

  created_at: item.created_at ?? null,

  updated_at: item.updated_at ?? null,
});
