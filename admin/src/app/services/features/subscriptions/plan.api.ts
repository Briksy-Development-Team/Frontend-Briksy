import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import type { Plan, PlanFormValues, PlanSubscriptionSummary } from "./plan.types";
import { mockPlanSubscriptionSummary, mockPlans, useMockListingData } from "../../mock/listingMocks";

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
  if (useMockListingData) {
    return {
      plans: mockPlans,
      subscription: mockPlanSubscriptionSummary,
    };
  }

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
  if (useMockListingData) {
    const plan = mockPlans.find((item) => item.id === planId) ?? mockPlans[0];

    return {
      plan,
      subscription: {
        ...mockPlanSubscriptionSummary,
        plan: plan
          ? {
              id: plan.id,
              name: plan.name,
              plan_family: plan.plan_family,
              price: plan.monthly_price ?? plan.yearly_price ?? 0,
            }
          : mockPlanSubscriptionSummary.plan,
      },
      current_subscription: {
        id: mockPlanSubscriptionSummary.current_subscription?.id ?? "subscription-mock",
        subscription_plan_id: plan?.id ?? mockPlans[0]?.id ?? "",
        status: "active",
        current_period_start: mockPlanSubscriptionSummary.current_subscription?.current_period_start ?? null,
        current_period_end: mockPlanSubscriptionSummary.current_subscription?.current_period_end ?? null,
      },
    };
  }

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
