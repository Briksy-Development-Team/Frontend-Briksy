import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

import type {
  Property,
  PropertyFormValues,
  PropertyListParams,
} from "./property.types";

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

export const createPropertyApi = async (payload: PropertyFormValues) => {
  const res = await axiosInstance.post<ApiResponse<Property>>(
    getBasePath(),
    payload,
  );

  return res.data.data;
};

export const updatePropertyApi = async (
  id: string,
  payload: PropertyFormValues,
) => {
  const res = await axiosInstance.put<ApiResponse<Property>>(
    `${getBasePath()}/${id}`,
    payload,
  );

  return res.data.data;
};

export const deletePropertyApi = async (id: string) => {
  await axiosInstance.delete(`${getBasePath()}/${id}`);
};
