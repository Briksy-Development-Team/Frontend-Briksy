import axiosInstance from "../../api/axiosInstance";
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

const BASE_PATH = "/super-admin/plans";

export const fetchPlansApi = async (): Promise<Plan[]> => {
  const response = await axiosInstance.get<PlanEnvelope>(BASE_PATH);
  const { data } = response.data || {};

  return Array.isArray(data) ? data : [];
};

export const createPlanApi = async (payload: PlanFormValues): Promise<Plan> => {
  const response = await axiosInstance.post<PlanEnvelope>(BASE_PATH, payload);
  return response.data.data as Plan;
};

export const updatePlanApi = async (
  id: string,
  payload: PlanFormValues,
): Promise<Plan> => {
  const response = await axiosInstance.put<PlanEnvelope>(`${BASE_PATH}/${id}`, payload);
  return response.data.data as Plan;
};

export const deletePlanApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${BASE_PATH}/${id}`);
};
