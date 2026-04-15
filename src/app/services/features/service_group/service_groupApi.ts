import axiosInstance from "../../api/axiosInstance";
import type { GetServiceGroupParams } from "./service_group.types";
import { buildApiParams } from "../../utils/buildApiParams";

export type { GetServiceGroupParams };

export const fetchServiceGroupApi = async (params: GetServiceGroupParams) => {
  const res = await axiosInstance.get("/super-admin/service-groups", {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};
