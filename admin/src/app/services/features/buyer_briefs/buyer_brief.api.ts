import axiosInstance from "../../api/axiosInstance";
import { buildApiParams } from "../../utils/buildApiParams";
import type { BuyerBriefFormValues } from "./buyer_brief.types";

export type BuyerBriefParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, unknown>;
};

const path = "/admin/buyer-briefs";

const toPayload = (values: BuyerBriefFormValues) => ({
  client_name: values.client_name.trim(),
  client_email: values.client_email.trim() || undefined,
  status: values.status,
  budget_min: values.budget_min ? Number(values.budget_min) : undefined,
  budget_max: values.budget_max ? Number(values.budget_max) : undefined,
  preferred_locations: values.preferred_locations.split(",").map((value) => value.trim()).filter(Boolean),
  preferences: {
    bedrooms: values.bedrooms.trim() || undefined,
    property_type: values.property_type.trim() || undefined,
  },
  notes: values.notes.trim() || undefined,
});

export const fetchBuyerBriefsApi = async (params: BuyerBriefParams) => {
  const response = await axiosInstance.get(path, { params: buildApiParams(params) });
  const payload = response.data?.data;
  return {
    data: Array.isArray(payload) ? payload : payload?.data ?? [],
    total: response.data?.meta?.pagination?.total ?? payload?.total ?? 0,
  };
};

export const fetchBuyerBriefApi = async (id: string) => {
  const response = await axiosInstance.get(`${path}/${id}`);
  return response.data?.data ?? response.data;
};

export const createBuyerBriefApi = async (values: BuyerBriefFormValues) =>
  (await axiosInstance.post(path, toPayload(values))).data?.data;

export const updateBuyerBriefApi = async (id: string, values: BuyerBriefFormValues) =>
  (await axiosInstance.put(`${path}/${id}`, toPayload(values))).data?.data;

export const deleteBuyerBriefApi = async (id: string) => {
  await axiosInstance.delete(`${path}/${id}`);
};
