import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

export type GetInquiryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};

const getBasePath = () => {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];

  return abilities.includes("super_admin") ? "/super-admin" : "/admin";
};

export const fetchInquiriesApi = async (params: GetInquiryParams) => {
  const res = await axiosInstance.get(`${getBasePath()}/inquiries`, {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const fetchInquiryApi = async (id: string) => {
  const res = await axiosInstance.get(`${getBasePath()}/inquiries/${id}`);

  return res.data;
};
