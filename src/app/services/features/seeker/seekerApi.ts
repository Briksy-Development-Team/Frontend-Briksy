import axiosInstance from "../../api/axiosInstance";
import type { GetSeekersParams } from "./seeker.types";

export const fetchSeekersApi = async (params: GetSeekersParams) => {
  const res = await axiosInstance.get("/super-admin/seekers", {
    params: {
      page: params.page,
      per_page: params.per_page,
    },
  });

  console.log("AXIOS FULL RESPONSE:", res);
  console.log("AXIOS DATA:", res.data);
  console.log("SEEKERS ARRAY:", res.data.data);
  console.log("PAGINATION:", res.data.meta);
  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};
