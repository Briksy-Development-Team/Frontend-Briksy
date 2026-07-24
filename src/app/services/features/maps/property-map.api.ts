import axiosInstance from "../../api/axiosInstance";
import { buildApiParams } from "../../utils/buildApiParams";
import type { PropertyMapItem } from "./property-map.types";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type PropertyMapQuery = {
  search?: string;
  filters?: Record<string, unknown>;
  sort?: string;
  direction?: "asc" | "desc";
};

type RawPropertyMapItem = {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;
  property_number?: string | null;
  title: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  status: string;
  location_verified?: boolean;
  verified?: boolean;
  organization_name?: string | null;
  organization?: {
    name?: string | null;
  } | null;
  property_type?: string | {
    name?: string | null;
  } | null;
  city?: string | null;
  suburb?: string | null;
  state?: string | null;
  country?: string | null;
  image_url?: string | null;
  images?: PropertyMapItem["images"];
  videos?: PropertyMapItem["videos"];
  address?: string | null;
  full_address?: string | null;
  formatted_address?: string | null;
  created_at?: string | null;
};

const getMapEndpoint = () => {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return "/admin/properties/map";
  }

  return "/v1/super-admin/property-map";
};

const normalizePropertyMapItem = (item: RawPropertyMapItem): PropertyMapItem => ({
  id: item.id,
  property_number:
    item.property_number ??
    item.display_id ??
    item.generated_id ??
    item.id,
  title: item.title,
  latitude:
    typeof item.latitude === "string" ? Number(item.latitude) : item.latitude ?? null,
  longitude:
    typeof item.longitude === "string" ? Number(item.longitude) : item.longitude ?? null,
  status: item.status,
  verified: Boolean(item.verified ?? item.location_verified),
  organization_name: item.organization_name ?? item.organization?.name ?? null,
  property_type:
    typeof item.property_type === "string"
      ? item.property_type
      : item.property_type?.name ?? null,
  city: item.city ?? item.suburb ?? null,
  state: item.state ?? null,
  country: item.country ?? null,
  image_url: item.image_url ?? item.images?.find((image) => image?.is_primary)?.url ?? item.images?.[0]?.url ?? null,
  images: item.images ?? [],
  videos: item.videos ?? [],
  address: item.address ?? item.formatted_address ?? item.full_address ?? null,
  created_at: item.created_at ?? null,
});

export const fetchPropertyMapApi = async (params: PropertyMapQuery = {}): Promise<PropertyMapItem[]> => {
  const response = await axiosInstance.get<ApiEnvelope<RawPropertyMapItem[]>>(getMapEndpoint(), {
    params: buildApiParams({
      search: params.search,
      sort: params.sort,
      direction: params.direction,
      filters: params.filters,
    }),
  });

  return Array.isArray(response.data.data) ? response.data.data.map(normalizePropertyMapItem) : [];
};
