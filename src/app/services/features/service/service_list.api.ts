import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

import type {
  Service,
  ServiceFormValues,
  GetServiceListParams,
} from "./service_list.types";

const getBasePath = () => {
  const auth = getAuth();

  return auth?.abilities?.includes("super_admin")
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

export const fetchServiceGroupApi = async (params: GetServiceListParams) => {
  const res = await axiosInstance.get<ApiResponse<Service[]>>(getBasePath(), {
    params: buildApiParams(params),
  });

  return {
    data: res.data.data ?? [],
    total: res.data.meta?.pagination?.total ?? 0,
  };
};

export const createServiceApi = async (payload: ServiceFormValues) => {
  const res = await axiosInstance.post<ApiResponse<Service>>(
    getBasePath(),
    payload,
  );

  return res.data.data;
};

export const updateServiceApi = async (
  id: string,
  payload: ServiceFormValues,
) => {
  const res = await axiosInstance.put<ApiResponse<Service>>(
    `${getBasePath()}/${id}`,
    payload,
  );

  return res.data.data;
};

export const deleteServiceApi = async (id: string) => {
  await axiosInstance.delete(`${getBasePath()}/${id}`);
};
