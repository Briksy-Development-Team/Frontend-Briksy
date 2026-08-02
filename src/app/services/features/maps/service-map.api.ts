import axiosInstance from "../../api/axiosInstance";
import type { ServiceMapItem } from "./service-map.types";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type RawServiceMapItem = {
  id: string;
  generated_id?: string | null;
  name: string;
  title?: string | null;
  category?: string | null;
  slug?: string | null;
  service_area?: string | null;
  service_area_geometry?: {
    type: "Polygon";
    coordinates: number[][][];
  } | null;
  rate_from?: number | string | null;
  rate_to?: number | string | null;
  is_active?: boolean;
  status?: string;
  organization?: ServiceMapItem["organization"];
  organization_type?: ServiceMapItem["organization_type"];
  created_at?: string | null;
};

const getMapEndpoint = () => {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return "/admin/services/map";
  }

  return "/super-admin/services/map";
};

export const fetchServiceMapApi = async (): Promise<ServiceMapItem[]> => {
  const response = await axiosInstance.get<ApiEnvelope<RawServiceMapItem[]>>(getMapEndpoint());

  return Array.isArray(response.data.data)
    ? response.data.data.map((item) => ({
        id: item.id,
        generated_id: item.generated_id ?? null,
        name: item.name,
        title: item.title ?? null,
        category: item.category ?? null,
        slug: item.slug ?? null,
        service_area: item.service_area ?? null,
        service_area_geometry: item.service_area_geometry ?? null,
        rate_from: typeof item.rate_from === "string" ? Number(item.rate_from) : item.rate_from ?? null,
        rate_to: typeof item.rate_to === "string" ? Number(item.rate_to) : item.rate_to ?? null,
        is_active: item.is_active,
        status: item.status ?? (item.is_active ? "Active" : "Inactive"),
        organization: item.organization ?? null,
        organization_type: item.organization_type ?? null,
        created_at: item.created_at ?? null,
      }))
    : [];
};
