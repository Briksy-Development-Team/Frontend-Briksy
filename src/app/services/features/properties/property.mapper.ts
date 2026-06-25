import type { Property, PropertyList } from "./property.types";

type PropertyApi = {
  id: string;

  title: string;

  status: "Draft" | "Published" | "Archived";

  description?: string | null;

  address?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  full_address?: string | null;
  formatted_address?: string | null;
  place_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  location_verified?: boolean;
  property_type_id?: string | null;
  property_type?: {
    id: string;
    name: string;
    slug?: string;
  } | null;

  rating?: number;

  images?: {
    id?: string;
    url: string;
  }[];

  videos?: {
    id?: string;
    url: string;
  }[];

  organization?: {
    id: string;
    name: string;
    slug?: string;
    is_verified?: boolean;
  } | null;

  creator?: {
    id: string;
    name: string;
    email?: string;
  } | null;

  created_at?: string | null;
  updated_at?: string | null;
};

export const mapPropertyGroup = (item: PropertyApi): PropertyList => ({
  id: item.id,
  title: item.title ?? "",
  status: item.status,

  description: item.description ?? null,

  rating: item.rating ?? undefined,

  address: item.address ?? null,
  address_line_1: item.address_line_1 ?? null,
  address_line_2: item.address_line_2 ?? null,
  full_address: item.full_address ?? null,
  formatted_address: item.formatted_address ?? null,
  place_id: item.place_id ?? null,
  latitude: item.latitude ?? null,
  longitude: item.longitude ?? null,
  suburb: item.suburb ?? null,
  state: item.state ?? null,
  postcode: item.postcode ?? null,
  country: item.country ?? null,
  location_verified: item.location_verified ?? false,
  property_type_id: item.property_type_id ?? null,
  property_type: item.property_type ?? null,

  organization: item.organization ?? null,
  creator: item.creator ?? null,

  created_at: item.created_at ?? null,
  updated_at: item.updated_at ?? null,
});

export const mapProperty = (item: PropertyApi): Property => ({
  id: item.id,

  title: item.title ?? "",

  status: item.status,

  description: item.description ?? null,

  address: item.address ?? null,
  address_line_1: item.address_line_1 ?? null,
  address_line_2: item.address_line_2 ?? null,
  full_address: item.full_address ?? null,
  formatted_address: item.formatted_address ?? null,
  place_id: item.place_id ?? null,
  latitude: item.latitude ?? null,
  longitude: item.longitude ?? null,
  suburb: item.suburb ?? null,
  state: item.state ?? null,
  postcode: item.postcode ?? null,
  country: item.country ?? null,
  location_verified: item.location_verified ?? false,
  property_type_id: item.property_type_id ?? null,
  property_type: item.property_type ?? null,

  rating: item.rating,

  images: item.images ?? [],
  videos: item.videos ?? [],

  organization: item.organization ?? null,
  creator: item.creator ?? null,

  created_at: item.created_at ?? null,
  updated_at: item.updated_at ?? null,
});
