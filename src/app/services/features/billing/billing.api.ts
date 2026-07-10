import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import type {
  Addon,
  BillingCheckoutAddonSelection,
  BillingCheckoutResponse,
  CompanySubscription,
  BillingCheckoutVerificationResponse,
  DynamicIdSetting,
  SubscriptionPlanBilling,
} from "./billing.types";

const getBasePath = () => {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];

  return abilities.includes("super_admin") ? "/super-admin" : "/admin";
};

export const fetchSuperAdminDynamicIdSettingsApi = async (): Promise<DynamicIdSetting[]> => {
  const response = await axiosInstance.get(`${getBasePath()}/dynamic-id-settings`);
  return response.data.data ?? [];
};

export const saveSuperAdminDynamicIdSettingApi = async (
  payload: Partial<DynamicIdSetting> & { entity_type: string },
  id?: string,
): Promise<DynamicIdSetting> => {
  const response = id
    ? await axiosInstance.put(`${getBasePath()}/dynamic-id-settings/${id}`, payload)
    : await axiosInstance.post(`${getBasePath()}/dynamic-id-settings`, payload);

  return response.data.data as DynamicIdSetting;
};

export const deleteSuperAdminDynamicIdSettingApi = async (id: string) => {
  await axiosInstance.delete(`${getBasePath()}/dynamic-id-settings/${id}`);
};

export const fetchSuperAdminAddonsApi = async (): Promise<Addon[]> => {
  const response = await axiosInstance.get(`${getBasePath()}/addons`);
  return response.data.data ?? [];
};

export const saveSuperAdminAddonApi = async (
  payload: Partial<Addon>,
  id?: string,
): Promise<Addon> => {
  const response = id
    ? await axiosInstance.put(`${getBasePath()}/addons/${id}`, payload)
    : await axiosInstance.post(`${getBasePath()}/addons`, payload);

  return response.data.data as Addon;
};

export const attachAddonToPlanApi = async (
  planId: string,
  addonId: string,
  payload: { included_quantity?: number | null; is_included?: boolean } = {},
) => {
  const response = await axiosInstance.post(`${getBasePath()}/plans/${planId}/addons`, {
    addon_id: addonId,
    ...payload,
  });

  return response.data.data as SubscriptionPlanBilling;
};

export const detachAddonFromPlanApi = async (planId: string, addonId: string) => {
  const response = await axiosInstance.delete(`${getBasePath()}/plans/${planId}/addons/${addonId}`);
  return response.data.data as SubscriptionPlanBilling;
};

export const deleteSuperAdminAddonApi = async (id: string) => {
  await axiosInstance.delete(`${getBasePath()}/addons/${id}`);
};

export const toggleSuperAdminAddonApi = async (id: string, is_active: boolean) => {
  const response = await axiosInstance.patch(`${getBasePath()}/addons/${id}/toggle`, { is_active });
  return response.data.data as Addon;
};

export const fetchSuperAdminSubscriptionsApi = async (params?: Record<string, string>): Promise<CompanySubscription[]> => {
  const response = await axiosInstance.get(`${getBasePath()}/subscriptions`, { params });
  return response.data.data ?? [];
};

export const fetchBillingCurrentSubscriptionApi = async (): Promise<CompanySubscription | null> => {
  const response = await axiosInstance.get("/admin/billing/current-subscription");
  return response.data.data?.subscription ?? null;
};

export const fetchBillingPlansApi = async (): Promise<SubscriptionPlanBilling[]> => {
  const response = await axiosInstance.get("/admin/billing/plans");
  return response.data.data?.plans ?? [];
};

export const fetchBillingAddonsApi = async (): Promise<Addon[]> => {
  const response = await axiosInstance.get("/admin/billing/addons");
  return response.data.data?.addons ?? [];
};

export const fetchBillingSubscriptionsApi = async (): Promise<CompanySubscription[]> => {
  const response = await axiosInstance.get("/admin/billing/subscriptions");
  return response.data.data?.subscriptions ?? [];
};

export const createBillingCheckoutApi = async (payload: {
  plan_id: string;
  billing_cycle: "monthly" | "yearly";
  addons?: BillingCheckoutAddonSelection[];
}): Promise<BillingCheckoutResponse> => {
  const response = await axiosInstance.post("/admin/billing/checkout", payload);
  return response.data.data ?? {};
};

export const verifyBillingCheckoutSessionApi = async (
  checkoutSessionId: string,
): Promise<BillingCheckoutVerificationResponse> => {
  const response = await axiosInstance.get(`/admin/billing/checkout/${checkoutSessionId}`);
  return response.data.data ?? {};
};
