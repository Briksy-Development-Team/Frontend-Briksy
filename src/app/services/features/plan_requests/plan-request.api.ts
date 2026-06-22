import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

import type { PlanRequestFormValues } from "./plan-request.types";

export type GetPlanRequestParams = {
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

export const fetchPlanRequestsApi = async (params: GetPlanRequestParams) => {
  const res = await axiosInstance.get(`${getBasePath()}/plan-requests`, {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const createPlanRequestApi = async (payload: PlanRequestFormValues) => {
  const res = await axiosInstance.post(
    `${getBasePath()}/plan-requests`,
    payload,
  );

  return res.data;
};

export const updatePlanRequestApi = async (
  id: string,
  payload: PlanRequestFormValues,
) => {
  const res = await axiosInstance.put(
    `${getBasePath()}/plan-requests/${id}`,
    payload,
  );

  return res.data;
};

export const deletePlanRequestApi = async (id: string) => {
  return axiosInstance.delete(`${getBasePath()}/plan-requests/${id}`);
};

export const approvePlanRequestApi = async (
  id: string,
  payload: {
    admin_notes?: string | null;
    create_order?: boolean;
    plan_id?: string | null;
    organization_id?: string | null;
  },
) => {
  const res = await axiosInstance.post(
    `/super-admin/plan-requests/${id}/approve`,
    payload,
  );

  return res.data;
};

export const rejectPlanRequestApi = async (
  id: string,
  payload: {
    admin_notes?: string | null;
    create_order?: boolean;
    plan_id?: string | null;
    organization_id?: string | null;
  },
) => {
  const res = await axiosInstance.post(
    `/super-admin/plan-requests/${id}/reject`,
    payload,
  );

  return res.data;
};
