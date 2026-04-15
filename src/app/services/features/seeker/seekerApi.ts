import axiosInstance from "../../api/axiosInstance";
import type { GetSeekersParams } from "./seeker.types";
import { buildApiParams } from "../../utils/buildApiParams";

export type { GetSeekersParams };

export const fetchSeekersApi = async (params: GetSeekersParams) => {
  const res = await axiosInstance.get("/super-admin/seekers", {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};