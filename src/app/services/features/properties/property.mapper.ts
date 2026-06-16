import type { Property, PropertyList } from "./property.types";

type PropertyApi = {
  id: string;

  title: string;

  status: "Draft" | "Published" | "Archived";

  description?: string | null;

  address?: string | null;
  suburb?: string | null;
  postcode?: string | null;

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

  suburb: item.suburb ?? null,
  postcode: item.postcode ?? null,

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
  suburb: item.suburb ?? null,
  postcode: item.postcode ?? null,

  rating: item.rating,

  images: item.images ?? [],
  videos: item.videos ?? [],

  organization: item.organization ?? null,
  creator: item.creator ?? null,

  created_at: item.created_at ?? null,
  updated_at: item.updated_at ?? null,
});
