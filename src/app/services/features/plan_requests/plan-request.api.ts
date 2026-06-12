import axiosInstance from "../../api/axiosInstance";
import type { PlanRequest, PlanRequestFormValues, PlanRequestReviewValues } from "./plan-request.types";

type ApiEnvelope = {
  success: boolean;
  message: string;
  data: PlanRequest | PlanRequest[];
};

const path = (scope: "admin" | "super-admin") => `/${scope}/plan-requests`;

export const fetchPlanRequestsApi = async (scope: "admin" | "super-admin"): Promise<PlanRequest[]> => {
  const response = await axiosInstance.get<ApiEnvelope>(path(scope));
  return Array.isArray(response.data.data) ? (response.data.data as PlanRequest[]) : [];
};

export const createPlanRequestApi = async (
  scope: "admin" | "super-admin",
  payload: PlanRequestFormValues,
): Promise<PlanRequest> => {
  const response = await axiosInstance.post<ApiEnvelope>(path(scope), payload);
  return response.data.data as PlanRequest;
};

export const updatePlanRequestApi = async (
  scope: "admin" | "super-admin",
  id: string,
  payload: PlanRequestFormValues,
): Promise<PlanRequest> => {
  const response = await axiosInstance.patch<ApiEnvelope>(`${path(scope)}/${id}`, payload);
  return response.data.data as PlanRequest;
};

export const deletePlanRequestApi = async (scope: "admin" | "super-admin", id: string): Promise<void> => {
  await axiosInstance.delete(`${path(scope)}/${id}`);
};

export const approvePlanRequestApi = async (
  id: string,
  payload: PlanRequestReviewValues,
): Promise<PlanRequest> => {
  const response = await axiosInstance.post<ApiEnvelope>(`/super-admin/plan-requests/${id}/approve`, payload);
  return response.data.data as PlanRequest;
};

export const rejectPlanRequestApi = async (
  id: string,
  payload: PlanRequestReviewValues,
): Promise<PlanRequest> => {
  const response = await axiosInstance.post<ApiEnvelope>(`/super-admin/plan-requests/${id}/reject`, payload);
  return response.data.data as PlanRequest;
};
