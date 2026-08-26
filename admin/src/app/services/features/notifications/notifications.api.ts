import axiosInstance from "../../api/axiosInstance";
import type { NotificationPreference, PlatformNotification } from "./notifications.types";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: {
      current_page?: number;
      per_page?: number;
      total?: number;
      last_page?: number;
    };
  };
};

const getBasePath = (scope: "admin" | "super-admin") => `/${scope}/notifications`;
const getPreferencesPath = (scope: "admin" | "super-admin") => `/${scope}/notification-preferences`;

export const fetchNotificationsApi = async (
  scope: "admin" | "super-admin",
  params?: Record<string, unknown>,
): Promise<{ items: PlatformNotification[]; total: number; currentPage: number; lastPage: number }> => {
  const response = await axiosInstance.get<ApiEnvelope<PlatformNotification[]>>(getBasePath(scope), { params });
  return {
    items: Array.isArray(response.data.data) ? response.data.data : [],
    total: response.data.meta?.pagination?.total ?? 0,
    currentPage: response.data.meta?.pagination?.current_page ?? 1,
    lastPage: response.data.meta?.pagination?.last_page ?? 1,
  };
};

export const fetchUnreadCountApi = async (scope: "admin" | "super-admin"): Promise<number> => {
  const response = await axiosInstance.get<ApiEnvelope<{ count: number }>>(`${getBasePath(scope)}/unread-count`);
  return response.data.data?.count ?? 0;
};

export const markNotificationReadApi = async (scope: "admin" | "super-admin", id: string) => {
  const response = await axiosInstance.patch<ApiEnvelope<PlatformNotification>>(`${getBasePath(scope)}/${id}/read`);
  return response.data.data;
};

export const markAllNotificationsReadApi = async (scope: "admin" | "super-admin") => {
  await axiosInstance.patch(`${getBasePath(scope)}/read-all`);
};

export const deleteNotificationApi = async (scope: "admin" | "super-admin", id: string) => {
  await axiosInstance.delete(`${getBasePath(scope)}/${id}`);
};

export const fetchNotificationPreferencesApi = async (
  scope: "admin" | "super-admin",
): Promise<NotificationPreference> => {
  const response = await axiosInstance.get<ApiEnvelope<NotificationPreference>>(getPreferencesPath(scope));
  return response.data.data;
};

export const updateNotificationPreferencesApi = async (
  scope: "admin" | "super-admin",
  payload: Partial<NotificationPreference>,
): Promise<NotificationPreference> => {
  const response = await axiosInstance.patch<ApiEnvelope<NotificationPreference>>(getPreferencesPath(scope), payload);
  return response.data.data;
};
