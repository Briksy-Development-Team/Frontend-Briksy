import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import type { Plan, PlanFormValues, PlanSubscriptionSummary } from "./plan.types";

type PlanEnvelope = {
  success: boolean;
  message: string;
  data: Plan[] | { plans?: Plan[]; subscription?: PlanSubscriptionSummary };
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

export const fetchPlansApi = async (): Promise<{
  plans: Plan[];
  subscription?: PlanSubscriptionSummary;
}> => {
  const response = await axiosInstance.get<PlanEnvelope>(
    `${getPlanBasePath()}/plans`,
  );
  const { data } = response.data || {};

  if (Array.isArray(data)) {
    return { plans: data };
  }

  return {
    plans: data?.plans ?? [],
    subscription: data?.subscription,
  };
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

export const changePlanApi = async (planId: string): Promise<{
  plan?: Plan;
  subscription?: PlanSubscriptionSummary;
  current_subscription?: {
    id: string;
    subscription_plan_id: string;
    status: string;
    current_period_start?: string | null;
    current_period_end?: string | null;
  };
  }> => {
  const response = await axiosInstance.post<PlanEnvelope>(
    `/admin/plans/${planId}/select`,
    {},
  );

  const { data } = response.data || {};

  if (Array.isArray(data)) {
    return { plan: data[0] };
  }

  return {
    plan: (data as { plan?: Plan })?.plan,
    subscription: (data as { subscription?: PlanSubscriptionSummary })?.subscription,
    current_subscription: (data as { current_subscription?: {
      id: string;
      subscription_plan_id: string;
      status: string;
      current_period_start?: string | null;
      current_period_end?: string | null;
    } })?.current_subscription,
  };
};
