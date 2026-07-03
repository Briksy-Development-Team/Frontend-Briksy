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

export const fetchSuperAdminReferralProgramsApi = async (): Promise<ReferralProgramOverview> => {
  const response = await axiosInstance.get<ReferralEnvelope<ReferralProgramOverview>>("/super-admin/referrals");
  return response.data.data;
};
