import api from "../clients.api";
import type { ApiPage } from "../clients.api";

export type PublicOrganization = {
  id: string;
  generated_id?: string | null;
  name: string;
  slug: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  rating: number;
  abn?: string | null;
  is_verified: boolean;
  is_favourite?: boolean;
  contact?: { email: string | null; phone: string | null };
  type?: { name: string; slug: string } | null;
  services?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    starting_price?: number | null;
    rate_from?: number | null;
    rate_to?: number | null;
    service_area?: string | null;
    service_area_geometry?: { type: "Polygon"; coordinates: number[][][] } | null;
    images?: { id: string; url: string }[];
    videos?: { id: string; url: string }[];
  }[];
  address?: string | null;
  state?: string | null;
  postcode?: string | null;
};

export const getOrganizations = async (params: Record<string, string | number | boolean | undefined> = {}) =>
  (await api.get<ApiPage<PublicOrganization>>("/seeker/organizations", { params: { per_page: 100, ...params } })).data;

export const getOrganization = async (id: string): Promise<{ data: PublicOrganization }> =>
  (await api.get<{ data: PublicOrganization }>(`/seeker/organizations/${id}`)).data;
