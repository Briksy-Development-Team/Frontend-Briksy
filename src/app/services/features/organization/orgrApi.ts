import type { GetOrganizationParams } from "./orgr.types";
import axiosInstance from "../../api/axiosInstance";

type QueryObject = Record<string, string | number | boolean>;

export const fetchOrganizationApi = async (params: GetOrganizationParams) => {
  const query: QueryObject = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 10,
  };

  if (params.search?.trim()) query.search = params.search.trim();
  if (params.sort) query.sort = params.sort;
  if (params.direction) query.direction = params.direction;

  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          query[`filter[${key}][${i}]`] = v;
        });
      } else {
        query[`filter[${key}]`] = value;
      }
    });
  }

  const res = await axiosInstance.get("/super-admin/organizations", {
    params: query,
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};
