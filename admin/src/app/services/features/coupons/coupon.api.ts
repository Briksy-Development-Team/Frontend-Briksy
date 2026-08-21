import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";

import type {
  Coupon,
  CouponFormValues,
  CouponValidationValues,
} from "./coupon.types";

export type GetCouponParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};

const getCouponBasePath = () => {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];

  return abilities.includes("super_admin") ? "/super-admin" : "/admin";
};

export const fetchCouponsApi = async (params: GetCouponParams) => {
  const res = await axiosInstance.get(`${getCouponBasePath()}/coupons`, {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const createCouponApi = async (payload: CouponFormValues) => {
  const res = await axiosInstance.post(
    `${getCouponBasePath()}/coupons`,
    payload,
  );

  return res.data;
};

export const updateCouponApi = async (
  id: string,
  payload: CouponFormValues,
) => {
  const res = await axiosInstance.patch(
    `${getCouponBasePath()}/coupons/${id}`,
    payload,
  );

  return res.data;
};

export const deleteCouponApi = async (id: string) => {
  await axiosInstance.delete(`${getCouponBasePath()}/coupons/${id}`);
};

export const activateCouponApi = async (id: string) => {
  const res = await axiosInstance.post(
    `${getCouponBasePath()}/coupons/${id}/activate`,
  );

  return res.data;
};

export const deactivateCouponApi = async (id: string) => {
  const res = await axiosInstance.post(
    `${getCouponBasePath()}/coupons/${id}/deactivate`,
  );

  return res.data;
};

export const validateCouponApi = async (payload: CouponValidationValues) => {
  const res = await axiosInstance.post(
    `${getCouponBasePath()}/coupons/validate`,
    payload,
  );

  return res.data;
};
