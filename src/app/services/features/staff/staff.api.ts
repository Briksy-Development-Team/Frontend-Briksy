import axiosInstance from "../../api/axiosInstance";
import { buildApiParams } from "../../utils/buildApiParams";
import type { GetStaffParams, StaffFormValues } from "./staff.types";

export const fetchStaffApi = async (params: GetStaffParams) => {
  const res = await axiosInstance.get("/super-admin/staff", {
    params: buildApiParams(params),
  });
  const { data, meta } = res.data || {};
  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const createStaffApi = async (payload: StaffFormValues) => {
  const res = await axiosInstance.post("/super-admin/staff", payload);
  return res.data;
};

export const updateStaffApi = async (id: string, payload: StaffFormValues) => {
  const res = await axiosInstance.put(`/super-admin/staff/${id}`, payload);
  return res.data;
};
