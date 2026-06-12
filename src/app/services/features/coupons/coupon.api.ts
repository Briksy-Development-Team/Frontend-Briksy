import axiosInstance from "../../api/axiosInstance";
import type { Coupon, CouponFormValues, CouponValidationValues } from "./coupon.types";

type ApiEnvelope = {
  success: boolean;
  message: string;
  data: Coupon | Coupon[] | { valid: boolean; discount_amount?: number; coupon?: Coupon };
};

const path = (scope: "admin" | "super-admin") => `/${scope}/coupons`;

export const fetchCouponsApi = async (scope: "admin" | "super-admin"): Promise<Coupon[]> => {
  const response = await axiosInstance.get<ApiEnvelope>(path(scope));
  return Array.isArray(response.data.data) ? (response.data.data as Coupon[]) : [];
};

export const createCouponApi = async (scope: "admin" | "super-admin", payload: CouponFormValues): Promise<Coupon> => {
  const response = await axiosInstance.post<ApiEnvelope>(path(scope), payload);
  return response.data.data as Coupon;
};

export const updateCouponApi = async (
  scope: "admin" | "super-admin",
  id: string,
  payload: CouponFormValues,
): Promise<Coupon> => {
  const response = await axiosInstance.patch<ApiEnvelope>(`${path(scope)}/${id}`, payload);
  return response.data.data as Coupon;
};

export const deleteCouponApi = async (scope: "admin" | "super-admin", id: string): Promise<void> => {
  await axiosInstance.delete(`${path(scope)}/${id}`);
};

export const activateCouponApi = async (id: string): Promise<Coupon> => {
  const response = await axiosInstance.post<ApiEnvelope>(`/super-admin/coupons/${id}/activate`);
  return response.data.data as Coupon;
};

export const deactivateCouponApi = async (id: string): Promise<Coupon> => {
  const response = await axiosInstance.post<ApiEnvelope>(`/super-admin/coupons/${id}/deactivate`);
  return response.data.data as Coupon;
};

export const validateCouponApi = async (
  scope: "admin" | "super-admin",
  payload: CouponValidationValues,
): Promise<{ valid: boolean; discount_amount?: number; coupon?: Coupon }> => {
  const response = await axiosInstance.post<ApiEnvelope>(`${path(scope)}/validate`, payload);
  return response.data.data as { valid: boolean; discount_amount?: number; coupon?: Coupon };
};
