import type { PropertyList } from "./property.types";

type PropertyListingApi = {
  id: string;
  title: string;
  status: "Draft" | "Published" | "Archived";
  description?: string | null;
  rating?: number;
  suburb?: string | null;
  postcode?: string | null;
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

export const mapPropertyGroup = (item: PropertyListingApi): PropertyList => ({
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
