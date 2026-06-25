import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

import type {
  Property,
  PropertyFormValues,
  PropertyListParams,
} from "./property.types";

const toFormData = (payload: PropertyFormValues) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("status", payload.status);

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

  if (payload.location_verified !== undefined && payload.location_verified !== null) {
    formData.append("location_verified", String(payload.location_verified));
  }

  payload.images?.forEach((file) => {
    if (file instanceof File) {
      formData.append("images", file);
    }
  });

  payload.videos?.forEach((file) => {
    if (file instanceof File) {
      formData.append("videos", file);
    }
  });

  return formData;
};

const getBasePath = () => {
  const auth = getAuth();

  return auth?.abilities?.includes("super_admin")
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

export const fetchPropertyListApi = async (params: PropertyListParams) => {
  const res = await axiosInstance.get<ApiResponse<Property[]>>(getBasePath(), {
    params: buildApiParams(params),
  });

  return {
    data: res.data.data ?? [],
    total: res.data.meta?.pagination?.total ?? 0,
  };
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
