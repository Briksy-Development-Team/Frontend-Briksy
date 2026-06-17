import axiosInstance from "../../api/axiosInstance";
import type { GetServiceListParams } from "./service_list.types";
import { buildApiParams } from "../../utils/buildApiParams";
import { API_ROUTES } from "../../api/routes";

export type { GetServiceListParams };

export const fetchServiceGroupApi = async (params: GetServiceListParams) => {
  try {
    const res = await axiosInstance.get(API_ROUTES.services, {
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
