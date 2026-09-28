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
      has_more_pages?: boolean;
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
  const basePath = getPlanBasePath();
  const isSuperAdmin = basePath === "/super-admin";
  const plans: Plan[] = [];
  let subscription: PlanSubscriptionSummary | undefined;
  let page = 1;
  let hasMorePages = false;

  do {
    const response = await axiosInstance.get<PlanEnvelope>(
      `${basePath}/plans`,
      isSuperAdmin ? { params: { page, per_page: 100 } } : undefined,
    );
    const { data } = response.data || {};

    if (Array.isArray(data)) {
      plans.push(...data);
      hasMorePages = Boolean(response.data?.meta?.pagination?.has_more_pages);
      page += 1;
      continue;
    }

    plans.push(...(data?.plans ?? []));
    subscription = data?.subscription;
    hasMorePages = false;
  } while (isSuperAdmin && hasMorePages);

  return { plans, subscription };
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
