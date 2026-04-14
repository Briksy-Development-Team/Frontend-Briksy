import axiosInstance from "../../api/axiosInstance";
import type { GetSeekersParams } from "./seeker.types";

export const fetchSeekersApi = async (params: GetSeekersParams) => {
  const res = await axiosInstance.get("/super-admin/seekers", {
    params: {
      page: params.page,
      per_page: params.per_page,
    },
  });


  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};
