import api from "../clients.api";
import type { ApiPage } from "../clients.api";
import type { PublicProperty } from "../property/property.api";

export type SeekerCollection = {
  id: string;
  name: string;
  properties_count: number;
  contains_property?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CollectionPropertiesPage = ApiPage<PublicProperty>;

export const getCollections = async (propertyId?: string) =>
  (await api.get<{ data: SeekerCollection[] }>("/seeker/collections", {
    params: propertyId ? { property_id: propertyId } : undefined,
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

export const addPropertyToCollection = async (collectionId: string, propertyId: string) =>
  (await api.post<{ data: SeekerCollection }>(`/seeker/collections/${collectionId}/properties`, { property_id: propertyId })).data;

export const removePropertyFromCollection = async (collectionId: string, propertyId: string) => {
  await api.delete(`/seeker/collections/${collectionId}/properties/${propertyId}`);
};
