import type { GetStaffParams } from "./staff.types";
import axiosInstance from "../../api/axiosInstance";

import { buildApiParams } from "../../utils/buildApiParams";

export const fetchStaffApi = async (params: GetStaffParams) => {
  const res = await axiosInstance.get("/super-admin/staff", {
    params: buildApiParams(params),
  });
  const { data, meta } = res.data || {};
  return { data: data ?? [], total: meta?.pagination?.total ?? 0 };
};
