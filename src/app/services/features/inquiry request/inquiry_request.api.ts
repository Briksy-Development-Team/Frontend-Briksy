import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

import type { InquiryRequestFormValues } from "./inquiry_request.types";

export type GetInquiryRequestParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};

const getBasePath = () => {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];

  return abilities.includes("super_admin") ? "/super-admin" : "/admin";
};

export const fetchInquiryRequestsApi = async (params: GetInquiryRequestParams) => {
  const res = await axiosInstance.get(`${getBasePath()}/inquiry-requests`, {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const createInquiryRequestApi = async (payload: InquiryRequestFormValues) => {
  const res = await axiosInstance.post(
    `${getBasePath()}/inquiry-requests`,
    payload,
  );

  return res.data;
};

export const updateInquiryRequestApi = async (
  id: string,
  payload: InquiryRequestFormValues,
) => {
  const res = await axiosInstance.put(
    `${getBasePath()}/inquiry-requests/${id}`,
    payload,
  );

  return res.data;
};

export const deleteInquiryRequestApi = async (id: string) => {
  return axiosInstance.delete(`${getBasePath()}/inquiry-requests/${id}`);
};

export const approveInquiryRequestApi = async (
  id: string,
  payload: {
    admin_notes?: string | null;
    create_order?: boolean;
    Inquiry_id?: string | null;
    organization_id?: string | null;
  },
) => {
  const res = await axiosInstance.post(
    `/super-admin/inquiry-requests/${id}/approve`,
    payload,
  );

  return res.data;
};

export const rejectInquiryRequestApi = async (
  id: string,
  payload: {
    admin_notes?: string | null;
    create_order?: boolean;
    Inquiry_id?: string | null;
    organization_id?: string | null;
  },
) => {
  const res = await axiosInstance.post(
    `/super-admin/inquiry-requests/${id}/reject`,
    payload,
  );

  return res.data;
};
