import axiosInstance from "../../api/axiosInstance";
import type { SettingItem } from "./settings.types";

type ApiEnvelope = {
  success: boolean;
  message: string;
  data: SettingItem[];
};

const platformPath = "/super-admin/settings";
const companyPath = "/admin/settings";

export const fetchPlatformSettingsApi = async (): Promise<SettingItem[]> => {
  const response = await axiosInstance.get<ApiEnvelope>(platformPath);
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const updatePlatformSettingsApi = async (settings: SettingItem[]): Promise<SettingItem[]> => {
  const response = await axiosInstance.patch<ApiEnvelope>(platformPath, { settings });
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const fetchCompanySettingsApi = async (): Promise<SettingItem[]> => {
  const response = await axiosInstance.get<ApiEnvelope>(companyPath);
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const updateCompanySettingsApi = async (settings: SettingItem[]): Promise<SettingItem[]> => {
  const response = await axiosInstance.patch<ApiEnvelope>(companyPath, { settings });
  return Array.isArray(response.data.data) ? response.data.data : [];
};
