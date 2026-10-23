import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import type { MarketingReelItem } from "../../../components/marketing/MarketingReelsSection";

export type MarketingReelEntity = "organization" | "property" | "builder-project" | "service";

export const uploadMarketingReelsApi = async (entity: MarketingReelEntity, entityId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("reels[]", file));
  const isSuperAdmin = getAuth()?.abilities?.some((ability) => ["super_admin", "super_admin_employee"].includes(ability));
  const response = await axiosInstance.post<{ data: { items: MarketingReelItem[] } }>(`${isSuperAdmin ? "/super-admin" : "/admin"}/marketing-reels/${entity}/${entityId}`, formData);
  return response.data.data.items;
};

export const deleteMarketingReelApi = async (id: string) => {
  const isSuperAdmin = getAuth()?.abilities?.some((ability) => ["super_admin", "super_admin_employee"].includes(ability));
  await axiosInstance.delete(`${isSuperAdmin ? "/super-admin" : ""}/marketing-reels/${id}`);
};
