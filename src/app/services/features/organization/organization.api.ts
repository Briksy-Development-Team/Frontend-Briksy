import axiosInstance from "../../api/axiosInstance";
import type { GetOrganizationParams, OrganizationFormValues } from "./organization.types";
import { buildApiParams } from "../../utils/buildApiParams";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";

const getOrganizationBasePath = () => {
  const auth = getAuth();
  const roles = auth?.abilities ?? [];

  return roles.includes("super_admin")
    ? "/super-admin/organizations"
    : "/admin/businesses";
};

export const fetchOrganizationApi = async (params: GetOrganizationParams) => {
  const res = await axiosInstance.get(getOrganizationBasePath(), {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};
  console.log(data);

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const updateOrganizationApi = async (
  id: string,
  payload: OrganizationFormValues,
) => {
  const response = await axiosInstance.put(`${getOrganizationBasePath()}/${id}`, payload);
  return response.data.data;
};

export const deleteOrganizationApi = async (id: string) => {
  await axiosInstance.delete(`/super-admin/organizations/${id}`);
};
