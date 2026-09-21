import api from "../clients.api";
import type { ApiPage } from "../clients.api";

export type PublicService = {
  id: string;
  generated_id?: string;
  name: string;
  title?: string | null;
  category?: string | null;
  slug?: string | null;
  description?: string | null;
  service_area?: string | null;
  service_area_geometry?: { type: "Polygon"; coordinates: number[][][] } | null;
  rate_from?: number | null;
  rate_to?: number | null;
  organization?: {
    id: string;
    name: string;
    slug?: string | null;
    is_verified: boolean;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: string | null;
    state?: string | null;
    postcode?: string | null;
    logo_url?: string | null;
    banner_url?: string | null;
  } | null;
  images: { id: string; url: string; is_primary: boolean; sort_order: number }[];
  videos: { id: string; url: string; is_primary: boolean; sort_order: number }[];
};

export const getServices = async (params: Record<string, string | number | undefined> = {}) =>
  (await api.get<ApiPage<PublicService>>("/seeker/services", { params: { per_page: 24, ...params } })).data;

export const getService = async (id: string): Promise<{ data: PublicService }> =>
  (await api.get<{ data: PublicService }>(`/seeker/services/${id}`)).data;
