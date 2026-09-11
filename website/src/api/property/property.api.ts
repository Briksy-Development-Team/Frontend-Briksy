import api from "../clients.api";
import type { ApiPage } from "../clients.api";

export type PublicProperty = {
  id: string;
  generated_id?: string;
  title: string;
  description: string | null;
  address: string | null;
  full_address: string | null;
  status: string | null;
  rating: number;
  bedroom_option?: string | null;
  bathroom_option?: string | null;
  floor_area_sqm?: number | null;
  location: { suburb: string | null; postcode: string | null; latitude: number | null; longitude: number | null };
  organization?: { id: string | null; name: string | null; is_verified: boolean } | null;
  media?: { url: string | null; is_primary: boolean }[];
};

export const getProperties = async (params: Record<string, string | number | boolean | undefined> = {}) =>
  (await api.get<ApiPage<PublicProperty>>("/seeker/properties", { params: { per_page: 16, ...params } })).data;

export const getProperty = async (id: string): Promise<{ data: PublicProperty }> =>
  (await api.get<{ data: PublicProperty }>(`/seeker/properties/${id}`)).data;
