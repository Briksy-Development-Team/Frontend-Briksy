import axiosInstance from "../../api/axiosInstance";
import type { GetOrganizationParams, OrganizationFormValues } from "./organization.types";
import { buildApiParams } from "../../utils/buildApiParams";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";

const getOrganizationBasePath = () => {
  const auth = getAuth();
  const roles = auth?.abilities ?? [];

  return roles.includes("super_admin") || roles.includes("super_admin_employee")
    ? "/super-admin/organizations"
    : "/admin/businesses";
};

export const fetchOrganizationByIdApi = async (id: string) => {
  const res = await axiosInstance.get(`${getOrganizationBasePath()}/${id}`);
  return res.data?.data ?? null;
};

export const fetchCurrentOrganizationApi = async () => {
  const res = await axiosInstance.get("/admin/businesses/current");
  return res.data?.data ?? null;
};

export const fetchOrganizationApi = async (params: GetOrganizationParams) => {
  const res = await axiosInstance.get(getOrganizationBasePath(), {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

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

export const uploadOrganizationMediaApi = async (
  id: string,
  media: { profile_image?: File; banner_image?: File },
) => {
  const formData = new FormData();
  if (media.profile_image) formData.append("profile_image", media.profile_image);
  if (media.banner_image) formData.append("banner_image", media.banner_image);

  const response = await axiosInstance.post(`/admin/businesses/${id}/media`, formData);
  return response.data.data;
};
