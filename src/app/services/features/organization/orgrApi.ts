import axiosInstance from "../../api/axiosInstance";
import type { GetOrganizationParams } from "./orgr.types";
import { buildApiParams } from "../../utils/buildApiParams";

export const fetchOrganizationApi = async (params: GetOrganizationParams) => {
  const res = await axiosInstance.get("/super-admin/organizations", {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};
  console.log(data);

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};
