import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import type { Plan, PlanFormValues } from "./plan.types";

type PlanEnvelope = {
  success: boolean;
  message: string;
  data: Plan | Plan[];
  meta?: {
    pagination?: {
      total?: number;
    };
  };
};

const getPlanBasePath = () => {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];
  return abilities.includes("super_admin") ? "/super-admin" : "/admin";
};

export const fetchPlansApi = async (): Promise<Plan[]> => {
  const response = await axiosInstance.get<PlanEnvelope>(
    `${getPlanBasePath()}/plans`,
  );
  const { data } = response.data || {};
  return Array.isArray(data) ? data : [];
};

export const createPlanApi = async (payload: PlanFormValues): Promise<Plan> => {
  const response = await axiosInstance.post<PlanEnvelope>(
    `${getPlanBasePath()}/plans`,
    payload,
  );
  return response.data.data as Plan;
};

export const updatePlanApi = async (
  id: string,
  payload: PlanFormValues,
): Promise<Plan> => {
  const response = await axiosInstance.put<PlanEnvelope>(
    `${getPlanBasePath()}/plans/${id}`,
    payload,
  );
  return response.data.data as Plan;
};

export const deletePlanApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${getPlanBasePath()}/plans/${id}`);
};

export const changePlanApi = async (planId: string): Promise<Plan> => {
  const response = await axiosInstance.post<PlanEnvelope>(
    `/admin/plans/${planId}/select`,
    {},
  );
  return response.data.data as Plan;
};
