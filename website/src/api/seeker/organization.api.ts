import api from "../clients.api";
import type { ApiPage } from "../clients.api";

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

export const getOrganizations = async (params: Record<string, string | number | boolean | undefined> = {}) =>
  (await api.get<ApiPage<PublicOrganization>>("/seeker/organizations", { params: { per_page: 100, ...params } })).data;

export const getOrganization = async (id: string) => (await api.get(`/seeker/organizations/${id}`)).data;
