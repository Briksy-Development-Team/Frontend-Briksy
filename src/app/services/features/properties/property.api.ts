import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import type { PropertyListParams } from "./property.types";
import { buildApiParams } from "../../utils/buildApiParams";

export type { PropertyListParams };

const getBasePath = () => {
  const auth = getAuth();
  return auth?.abilities?.includes("super_admin")
    ? "/super-admin/properties"
    : "/admin/properties";
};

export const fetchPropertyListApi = async (params: PropertyListParams) => {
  try {
    const res = await axiosInstance.get(getBasePath(), {
      params: buildApiParams(params),
    });

    const { data, meta } = res.data || {};

    return {
      data: data ?? [],
      total: meta?.pagination?.total ?? 0,
    };
  } catch (error) {
    return {
      data: [],
      total: 0,
    };
  }
};
