import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

import type {
  Property,
  PropertyFormValues,
  PropertyListParams,
  PropertyFeatureGroup,
} from "./property.types";

const toFormData = (payload: PropertyFormValues) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  if (payload.organization_id) formData.append("organization_id", payload.organization_id);
  formData.append("status", payload.status);
  if (payload.listing_purpose) formData.append("listing_purpose", payload.listing_purpose);
  if (payload.transaction_status) formData.append("transaction_status", payload.transaction_status);
  formData.append("is_auction", payload.is_auction ? "1" : "0");
  if (payload.is_auction && payload.auction_date) formData.append("auction_date", payload.auction_date);
  if (payload.is_auction && payload.auction_time) formData.append("auction_time", payload.auction_time);
  if (payload.is_auction && payload.auction_venue) formData.append("auction_venue", payload.auction_venue);
  if (payload.is_auction && payload.auctioneer) formData.append("auctioneer", payload.auctioneer);
  if (payload.is_auction && payload.auction_contact) formData.append("auction_contact", payload.auction_contact);
  if (payload.is_auction && payload.auction_description) formData.append("auction_description", payload.auction_description);
  if (payload.price !== undefined && payload.price !== null && payload.price !== "") formData.append("price", String(payload.price));
  if (payload.pricing_type) formData.append("pricing_type", payload.pricing_type);
  if (payload.pricing_type === "estimated") {
    if (payload.price_min !== undefined && payload.price_min !== null && payload.price_min !== "") formData.append("price_min", String(payload.price_min));
    if (payload.price_max !== undefined && payload.price_max !== null && payload.price_max !== "") formData.append("price_max", String(payload.price_max));
  }

  if (payload.description) {
    formData.append("description", payload.description);
  }

  if (payload.address) {
    formData.append("address", payload.address);
  }

  if (payload.address_line_1) {
    formData.append("address_line_1", payload.address_line_1);
  }

  if (payload.address_line_2) {
    formData.append("address_line_2", payload.address_line_2);
  }

  if (payload.full_address) {
    formData.append("full_address", payload.full_address);
  }

  if (payload.formatted_address) {
    formData.append("formatted_address", payload.formatted_address);
  }

  if (payload.place_id) {
    formData.append("place_id", payload.place_id);
  }

  if (payload.latitude !== undefined && payload.latitude !== null && payload.latitude !== "") {
    formData.append("latitude", String(payload.latitude));
  }

  if (payload.longitude !== undefined && payload.longitude !== null && payload.longitude !== "") {
    formData.append("longitude", String(payload.longitude));
  }

  if (payload.suburb) {
    formData.append("suburb", payload.suburb);
  }

  if (payload.state) {
    formData.append("state", payload.state);
  }

  if (payload.postcode) {
    formData.append("postcode", payload.postcode);
  }

  if (payload.country) {
    formData.append("country", payload.country);
  }

  if (payload.property_type_id) {
    formData.append("property_type_id", payload.property_type_id);
  }

  payload.features?.forEach((featureId) => formData.append("features[]", featureId));

  if (payload.location_verified !== undefined && payload.location_verified !== null) {
    formData.append("location_verified", payload.location_verified ? "1" : "0");
  }

  payload.images?.forEach((file) => {
    if (file instanceof File) {
      formData.append("images[]", file);
    }
  });

  payload.videos?.forEach((file) => {
    if (file instanceof File) {
      formData.append("videos[]", file);
    }
  });
  if (payload.floorplan instanceof File) formData.append("floorplan", payload.floorplan);

  return formData;
};

export const fetchPropertyFeaturesApi = async (): Promise<PropertyFeatureGroup[]> => {
  const res = await axiosInstance.get<ApiResponse<PropertyFeatureGroup[]>>(`${getBasePath().replace("/properties", "/property-features")}`);
  return res.data.data ?? [];
};

export type PropertyTypeOption = {
  id: string;
  name: string;
  slug?: string | null;
  category?: string | null;
};

export const fetchPropertyTypesApi = async (): Promise<PropertyTypeOption[]> => {
  const res = await axiosInstance.get<ApiResponse<PropertyTypeOption[]>>(
    getBasePath().replace("/properties", "/property-types"),
  );
  return res.data.data ?? [];
};

const getBasePath = () => {
  const auth = getAuth();

  return auth?.abilities?.some((ability) =>
    ["super_admin", "super_admin_employee"].includes(ability),
  )
    ? "/super-admin/properties"
    : "/admin/properties";
};


type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: {
      total?: number;
    };
  };
};

export const fetchPropertyListApi = async (params: PropertyListParams, organizationId?: string) => {
  const path = organizationId
    ? getBasePath().replace("/properties", `/organizations/${organizationId}/properties`)
    : getBasePath();
  const res = await axiosInstance.get<ApiResponse<Property[]>>(path, {
    params: buildApiParams(params),
  });

  return {
    data: res.data.data ?? [],
    total: res.data.meta?.pagination?.total ?? 0,
  };
};

export const fetchPropertyApi = async (id: string): Promise<Property | null> => {
  const res = await axiosInstance.get<ApiResponse<Property>>(`${getBasePath()}/${id}`);

  return res.data.data;
};

export const fetchPropertyMapApi = async (params: PropertyListParams) => {
  const res = await axiosInstance.get<ApiResponse<Property[]>>(`${getBasePath()}/map`, {
    params: buildApiParams(params),
  });

  return Array.isArray(res.data.data) ? res.data.data : [];
};

export const createPropertyApi = async (payload: PropertyFormValues) => {
  const res = await axiosInstance.post<ApiResponse<Property>>(
    getBasePath(),
    toFormData(payload),
  );

  return res.data.data;
};

export const updatePropertyApi = async (
  id: string,
  payload: PropertyFormValues,
) => {
  const hasFiles = [...(payload.images ?? []), ...(payload.videos ?? []), payload.floorplan].some(
    (item) => item instanceof File,
  );

  if (!hasFiles) {
    const { images: _images, videos: _videos, floorplan: _floorplan, ...jsonPayload } = payload;
    const res = await axiosInstance.put<ApiResponse<Property>>(
      `${getBasePath()}/${id}`,
      jsonPayload,
    );

    return res.data.data;
  }

  const formData = toFormData(payload);
  formData.append("_method", "PUT");

  const res = await axiosInstance.post<ApiResponse<Property>>(
    `${getBasePath()}/${id}`,
    formData,
  );

  return res.data.data;
};

export const deletePropertyApi = async (id: string) => {
  await axiosInstance.delete(`${getBasePath()}/${id}`);
};

export const approvePropertyApi = async (id: string) => {
  const res = await axiosInstance.patch<ApiResponse<Property>>(`${getBasePath()}/${id}/approve`);
  return res.data.data;
};

export const rejectPropertyApi = async (id: string, rejection_reason: string) => {
  const res = await axiosInstance.patch<ApiResponse<Property>>(`${getBasePath()}/${id}/reject`, {
    rejection_reason,
  });
  return res.data.data;
};

export const verifyPropertyLocationApi = async (id: string) => {
  const res = await axiosInstance.patch<ApiResponse<Property>>(`${getBasePath()}/${id}/verify-location`);
  return res.data.data;
};

export const unverifyPropertyLocationApi = async (id: string) => {
  const res = await axiosInstance.patch<ApiResponse<Property>>(`${getBasePath()}/${id}/unverify-location`);
  return res.data.data;
};

export const deletePropertyMediaApi = async (mediaId: string) => {
  await axiosInstance.delete(`/media/${mediaId}`);
};
