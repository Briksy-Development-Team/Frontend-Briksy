import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";
import type { GetStaffParams, StaffFormValues } from "./staff.types";

const getStaffBasePath = () => {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];

  return abilities.includes("super_admin") ? "/super-admin" : "/admin";
};

export const fetchStaffApi = async (params: GetStaffParams) => {
  const res = await axiosInstance.get(`${getStaffBasePath()}/staff`, {
    params: buildApiParams(params),
  });
  const { data, meta } = res.data || {};
  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const createStaffApi = async (payload: StaffFormValues) => {
  const res = await axiosInstance.post(`${getStaffBasePath()}/staff`, payload);
  return res.data;
};

export const updateStaffApi = async (id: string, payload: StaffFormValues) => {
  const res = await axiosInstance.put(
    `${getStaffBasePath()}/staff/${id}`,
    payload,
  );
  return res.data;
};

export const deleteStaffApi = async (id: string) => {
  await axiosInstance.delete(`${getStaffBasePath()}/staff/${id}`);
};
