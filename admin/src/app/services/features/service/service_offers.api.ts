import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";

export type ServiceOffer = {
  id: string;
  service_id: string;
  title: string;
  tag_label?: string | null;
  summary?: string | null;
  description?: string | null;
  highlights?: string[] | null;
  terms?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  sort_order: number;
  service?: { id: string; generated_id?: string | null; name: string; category?: string | null } | null;
};

const getBasePath = () =>
  getAuth()?.abilities?.includes("super_admin") ? "/super-admin/service-offers" : "/admin/service-offers";

type ApiResponse<T> = { success: boolean; message: string; data: T };

export const fetchServiceOffersApi = async (): Promise<ServiceOffer[]> => {
  const response = await axiosInstance.get<ApiResponse<ServiceOffer[]>>(getBasePath(), {
    params: { per_page: 100, sort: "sort_order", direction: "asc" },
  });
  return response.data.data ?? [];
};

export const saveServiceOfferApi = async (payload: Partial<ServiceOffer> & { service_id: string; title: string }, id?: string) => {
  const response = id
    ? await axiosInstance.put<ApiResponse<ServiceOffer>>(`${getBasePath()}/${id}`, payload)
    : await axiosInstance.post<ApiResponse<ServiceOffer>>(getBasePath(), payload);
  return response.data.data;
};

export const deleteServiceOfferApi = async (id: string) => {
  await axiosInstance.delete(`${getBasePath()}/${id}`);
};

export const toggleServiceOfferApi = async (id: string, is_active: boolean) => {
  const response = await axiosInstance.patch<ApiResponse<ServiceOffer>>(`${getBasePath()}/${id}/toggle`, { is_active });
  return response.data.data;
};
