import api from "./clients.api";

export type ApiPage<T> = {
  success: boolean;
  data: T[];
  meta?: { pagination?: { total: number; last_page: number; current_page: number } };
};

export type PublicOrganization = {
  id: string;
  name: string;
  slug: string | null;
  rating: number;
  is_verified: boolean;
  contact?: { email: string | null; phone: string | null };
  type?: { name: string; slug: string } | null;
  services?: { name: string; slug: string }[];
  address?: string | null;
  state?: string | null;
  postcode?: string | null;
};

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

export const getOrganizations = async (params: Record<string, string | number | boolean | undefined> = {}) =>
  (await api.get<ApiPage<PublicOrganization>>("/seeker/organizations", { params: { per_page: 100, ...params } })).data;

export const getProperties = async (params: Record<string, string | number | boolean | undefined> = {}) =>
  (await api.get<ApiPage<PublicProperty>>("/seeker/properties", { params: { per_page: 100, ...params } })).data;

export const getOrganization = async (id: string) => (await api.get(`/seeker/organizations/${id}`)).data;
export const getProperty = async (id: string) => (await api.get(`/seeker/properties/${id}`)).data;
