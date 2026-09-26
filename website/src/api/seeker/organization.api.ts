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
  reviews_count?: number;
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

export type PublicBuilderProject = {
  id: string;
  name: string;
  project_type?: string | null;
  status: string;
  description?: string | null;
  features?: string[] | null;
  location?: string | null;
  state?: string | null;
  postcode?: string | null;
  images?: { id?: string; url: string; is_primary?: boolean }[];
  videos?: { id?: string; url: string }[];
  organization?: { id: string; name: string; slug?: string | null; logo_url?: string | null } | null;
  creator?: { id: string; name: string; email?: string | null; mobile_number?: string | null } | null;
};

export const getOrganizations = async (params: Record<string, string | number | boolean | undefined> = {}) => {
  const response = await api.get<ApiPage<PublicOrganization>>("/seeker/organizations", { params: { per_page: 100, ...params } });
  if (!Array.isArray(response.data?.data)) {
    throw new Error("The organizations API returned an invalid response.");
  }
  return response.data;
};

export const getOrganization = async (id: string): Promise<{ data: PublicOrganization }> =>
  (await api.get<{ data: PublicOrganization }>(`/seeker/organizations/${id}`)).data;

export const getBuilderProjects = async (organizationId: string): Promise<PublicBuilderProject[]> =>
  (await api.get<{ data: PublicBuilderProject[] }>(`/seeker/organizations/${organizationId}/builder-projects`)).data.data;

export const getBuilderProject = async (projectId: string): Promise<{ data: PublicBuilderProject }> =>
  (await api.get<{ data: PublicBuilderProject }>(`/seeker/builder-projects/${projectId}`)).data;
