import axiosInstance from "../../api/axiosInstance";
import { buildApiParams } from "../../utils/buildApiParams";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import type {
  ActivityLog,
  ActivityLogListResponse,
  ActivityLogQueryParams,
} from "./activity-log.types";

const getActivityLogBasePath = () => {
  const auth = getAuth();
  const roles = auth?.abilities ?? [];

  return roles.includes("super_admin") ? "/super-admin/activity-logs" : "/admin/activity-logs";
};

export const fetchActivityLogsApi = async (
  params: ActivityLogQueryParams,
): Promise<ActivityLogListResponse> => {
  const res = await axiosInstance.get(getActivityLogBasePath(), {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: Array.isArray(data) ? (data as ActivityLog[]) : [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const fetchActivityLogApi = async (id: string): Promise<ActivityLog> => {
  const res = await axiosInstance.get(`${getActivityLogBasePath()}/${id}`);
  return res.data?.data as ActivityLog;
};
