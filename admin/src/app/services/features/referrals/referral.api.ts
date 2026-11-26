import { buildApiParams } from "../../utils/buildApiParams";
import axiosInstance from "../../api/axiosInstance";
import type { ReferralDashboard, ReferralProgramOverview } from "./referral.types";

type ReferralEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const fetchAdminReferralDashboardApi = async (): Promise<ReferralDashboard> => {
  const response = await axiosInstance.get<ReferralEnvelope<ReferralDashboard>>("/admin/referrals");
  return response.data.data;
};

export const fetchSuperAdminReferralProgramsApi = async (params: Parameters<typeof buildApiParams>[0] = {}, signal?: AbortSignal): Promise<ReferralProgramOverview> => {
  const response = await axiosInstance.get<ReferralEnvelope<ReferralProgramOverview>>("/super-admin/referrals", { params: buildApiParams(params), signal });
  return response.data.data;
};
