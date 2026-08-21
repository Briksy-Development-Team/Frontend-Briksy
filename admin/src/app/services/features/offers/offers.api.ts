import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import type { PropertyOffer } from "../properties/property.types";

const getBasePath = () => {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];

  return abilities.includes("super_admin") ? "/super-admin/property-offers" : "/admin/property-offers";
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

export const fetchPropertyOffersApi = async (): Promise<PropertyOffer[]> => {
  const response = await axiosInstance.get<ApiResponse<PropertyOffer[]>>(getBasePath(), {
    params: {
      per_page: 100,
      sort: "sort_order",
      direction: "asc",
    },
  });

  return response.data.data ?? [];
};

export const savePropertyOfferApi = async (
  payload: Partial<PropertyOffer> & { property_listing_id: string; title: string },
  id?: string,
): Promise<PropertyOffer> => {
  const response = id
    ? await axiosInstance.put<ApiResponse<PropertyOffer>>(`${getBasePath()}/${id}`, payload)
    : await axiosInstance.post<ApiResponse<PropertyOffer>>(getBasePath(), payload);

  return response.data.data;
};

export const deletePropertyOfferApi = async (id: string) => {
  await axiosInstance.delete(`${getBasePath()}/${id}`);
};

export const togglePropertyOfferApi = async (id: string, is_active: boolean): Promise<PropertyOffer> => {
  const response = await axiosInstance.patch<ApiResponse<PropertyOffer>>(`${getBasePath()}/${id}/toggle`, {
    is_active,
  });

  return response.data.data;
};
