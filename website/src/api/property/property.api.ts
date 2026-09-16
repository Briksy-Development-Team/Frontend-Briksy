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
  listing_purpose?: "SELL" | "RENT" | "BOTH" | null;
  price?: number | null;

  property_type?: {
    name: string;
    slug?: string;
    category?: string | null;
  } | null;

  land_area_sqm?: number | null;
  car_space_option?: string | null;

  features?: {
    name: string;
    slug: string;
  }[];

  rating: number;
  bedroom_option?: string | null;
  bathroom_option?: string | null;
  floor_area_sqm?: number | null;

  location: {
    suburb: string | null;
    postcode: string | null;
    latitude: number | null;
    longitude: number | null;
    state?: string | null;
  };

  organization?: {
    id: string | null;
    name: string | null;
    slug?: string | null;
    logo_url?: string | null;
    banner_url?: string | null;
    is_verified: boolean;
  } | null;

  media?: {
    id?: string;
    url: string | null;
    type: "image" | "video";
    is_primary: boolean;
  }[];

  images?: {
    url: string | null;
    is_primary: boolean;
  }[];

  videos?: {
    url: string | null;
    is_primary: boolean;
  }[];
};

export const getProperties = async (
  params: Record<string, string | number | boolean | string[] | undefined> = {},
) => {
  const response = await api.get<ApiPage<PublicProperty>>(
    "/seeker/properties",
    {
      params: {
        per_page: 24,
        ...params,
      },
    },
  );

  console.log("Properties API response:", response.data);

  return response.data;
};

export const getProperty = async (
  id: string,
): Promise<{ data: PublicProperty }> => {
  const response = await api.get<{ data: PublicProperty }>(
    `/seeker/properties/${id}`,
  );


  return response.data;
};
