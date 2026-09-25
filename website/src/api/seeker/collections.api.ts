import api from "../clients.api";
import type { ApiPage } from "../clients.api";
import type { PublicProperty } from "../property/property.api";
import type { PublicOrganization } from "./organization.api";

export type SeekerCollection = {
  id: string;
  name: string;
  properties_count: number;
  items_count?: number;
  is_default?: boolean;
  contains_property?: boolean;
  contains_item?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CollectionPropertiesPage = ApiPage<PublicProperty>;
export type CollectionItem = {
  id: string;
  type: "property" | "organization" | "service" | null;
  target: (PublicProperty | PublicOrganization | { id: string }) | null;
  created_at?: string;
};
export type CollectionItemsPage = ApiPage<CollectionItem>;

export const getCollections = async (propertyId?: string) =>
  (await api.get<{ data: SeekerCollection[] }>("/seeker/collections", {
    params: propertyId ? { property_id: propertyId } : undefined,
  })).data;

export type CollectionTargetType = "property" | "service" | "organization";

export const getCollectionsForTarget = async (type: CollectionTargetType, targetId: string) =>
  (await api.get<{ data: SeekerCollection[] }>("/seeker/collections", {
    params: { target_type: type, target_id: targetId },
  })).data;

export const createCollection = async (name: string) =>
  (await api.post<{ data: SeekerCollection }>("/seeker/collections", { name })).data;

export const renameCollection = async (id: string, name: string) =>
  (await api.patch<{ data: SeekerCollection }>(`/seeker/collections/${id}`, { name })).data;

export const deleteCollection = async (id: string) => {
  await api.delete(`/seeker/collections/${id}`);
};

export const getCollectionProperties = async (id: string, page = 1) =>
  (await api.get<CollectionPropertiesPage>(`/seeker/collections/${id}/properties`, { params: { page, per_page: 24 } })).data;

export const getCollectionItems = async (id: string, page = 1) =>
  (await api.get<CollectionItemsPage>(`/seeker/collections/${id}/items`, { params: { page, per_page: 24 } })).data;

export const addPropertyToCollection = async (collectionId: string, propertyId: string) =>
  (await api.post<{ data: SeekerCollection }>(`/seeker/collections/${collectionId}/properties`, { property_id: propertyId })).data;

export const removePropertyFromCollection = async (collectionId: string, propertyId: string) => {
  await api.delete(`/seeker/collections/${collectionId}/properties/${propertyId}`);
};

export const addItemToCollection = async (collectionId: string, type: CollectionTargetType, targetId: string) =>
  (await api.post<{ data: SeekerCollection }>(`/seeker/collections/${collectionId}/items`, { type, target_id: targetId })).data;

export const removeItemFromCollection = async (collectionId: string, type: CollectionTargetType, targetId: string) => {
  await api.delete(`/seeker/collections/${collectionId}/items/${type}/${targetId}`);
};
