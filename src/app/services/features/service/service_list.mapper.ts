import type {
  Service,
  ServiceList,
  ServiceCategory,
} from "./service_list.types";

type ServiceApi = {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;

  name: string;

  slug?: string | null;

  title?: string | null;

  description?: string | null;

  category?: ServiceCategory;

  service_area?: string | null;

  service_area_geometry?: {
    type: "Polygon";
    coordinates: number[][][];
  } | null;

  rate_from?: number | null;

  rate_to?: number | null;

  is_active?: boolean;

  image?: string | null;

  organization_type?: {
    id: string;
    name: string;
    slug: string;
  };

  organization_count?: number;

  service_group_count?: number;

  created_at?: string | null;
  updated_at?: string | null;
};

export const mapServiceList = (item: ServiceApi): ServiceList => ({
  id: item.id,
  generated_id: item.generated_id ?? null,
  display_id: item.display_id ?? item.generated_id ?? null,

  name: item.name ?? "",

  slug: item.slug ?? null,

  title: item.title ?? null,

  description: item.description ?? null,

  category: item.category,

  service_area: item.service_area ?? null,

  service_area_geometry: item.service_area_geometry ?? null,

  rate_from: item.rate_from ?? null,

  rate_to: item.rate_to ?? null,

  is_active: item.is_active,

  image: item.image ?? null,

  organization_type: item.organization_type ?? null,

  organization_count: item.organization_count ?? 0,

  service_group_count: item.service_group_count ?? 0,

  created_at: item.created_at ?? null,

  updated_at: item.updated_at ?? null,
});

export const mapService = (item: ServiceApi): Service => ({
  id: item.id,
  generated_id: item.generated_id ?? null,
  display_id: item.display_id ?? item.generated_id ?? null,

  name: item.name ?? "",

  slug: item.slug ?? null,

  title: item.title ?? null,

  description: item.description ?? null,

  category: item.category,

  service_area: item.service_area ?? null,

  service_area_geometry: item.service_area_geometry ?? null,

  rate_from: item.rate_from ?? null,

  rate_to: item.rate_to ?? null,

  is_active: item.is_active,

  image: item.image ?? null,

  created_at: item.created_at ?? null,

  updated_at: item.updated_at ?? null,
});
