import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

import type {
  Service,
  ServiceFormValues,
  GetServiceListParams,
} from "./service_list.types";

export type { GetServiceListParams } from "./service_list.types";

const getBasePath = () => {
  const auth = getAuth();

  return auth?.abilities?.some((ability) =>
    ["super_admin", "super_admin_employee"].includes(ability),
  )
    ? "/super-admin/services"
    : "/admin/services";
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

const toFormData = (payload: ServiceFormValues) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === "images" || key === "videos" || key === "image" || value === undefined || value === null) return;
    if (typeof value === "boolean") formData.append(key, value ? "1" : "0");
    else if (typeof value === "object") formData.append(key, JSON.stringify(value));
    else formData.append(key, String(value));
  });
  payload.images?.forEach((file) => { if (file instanceof File) formData.append("images[]", file); });
  payload.videos?.forEach((file) => { if (file instanceof File) formData.append("videos[]", file); });
  return formData;
};

export type ServiceCategoryOption = { slug: string; label: string; name: string };

export const fetchServiceCategoriesApi = async () => {
  const res = await axiosInstance.get<ApiResponse<{ active: boolean; categories: ServiceCategoryOption[]; message?: string | null }>>(`${getBasePath()}/categories`);
  return res.data.data;
};

export const fetchServiceGroupApi = async (params: GetServiceListParams, organizationId?: string) => {
  const path = organizationId
    ? getBasePath().replace("/services", `/organizations/${organizationId}/services`)
    : getBasePath();
  const res = await axiosInstance.get<ApiResponse<Service[]>>(path, {
    params: buildApiParams(params),
  });

  return {
    data: res.data.data ?? [],
    total: res.data.meta?.pagination?.total ?? 0,
  };
};

export const createServiceApi = async (payload: ServiceFormValues) => {
  const hasFiles = [...(payload.images ?? []), ...(payload.videos ?? [])].some((item) => item instanceof File);
  const res = await axiosInstance.post<ApiResponse<Service>>(getBasePath(), hasFiles ? toFormData(payload) : payload);

  return res.data.data;
};

export const updateServiceApi = async (
  id: string,
  payload: ServiceFormValues,
) => {
  const hasFiles = [...(payload.images ?? []), ...(payload.videos ?? [])].some((item) => item instanceof File);
  const formData = toFormData(payload);
  if (hasFiles) {
    formData.append("_method", "PUT");
  }
  const res = hasFiles
    ? await axiosInstance.post<ApiResponse<Service>>(`${getBasePath()}/${id}`, formData)
    : await axiosInstance.put<ApiResponse<Service>>(`${getBasePath()}/${id}`, payload);

  return res.data.data;
};

export const deleteServiceApi = async (id: string) => {
  await axiosInstance.delete(`${getBasePath()}/${id}`);
};

export const deleteServiceMediaApi = async (id: string) => {
  await axiosInstance.delete(`/service-media/${id}`);
};
