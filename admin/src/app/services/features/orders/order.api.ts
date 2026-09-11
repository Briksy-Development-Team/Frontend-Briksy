import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";
import { buildApiParams } from "../../utils/buildApiParams";
import type { OrderFormValues, GetOrderParams } from "./order.types";

const getOrderBasePath = () => {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];

  return abilities.includes("super_admin") ? "/super-admin" : "/admin";
};

export const fetchOrdersApi = async (params: GetOrderParams) => {
  const res = await axiosInstance.get(`${getOrderBasePath()}/orders`, {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const createOrderApi = async (payload: OrderFormValues) => {
  const res = await axiosInstance.post(`${getOrderBasePath()}/orders`, payload);

  return res.data;
};

export const updateOrderApi = async (id: string, payload: OrderFormValues) => {
  const res = await axiosInstance.put(
    `${getOrderBasePath()}/orders/${id}`,
    payload,
  );

  return res.data;
};

export const deleteOrderApi = async (id: string) => {
  return axiosInstance.delete(`${getOrderBasePath()}/orders/${id}`);
};

export const cancelOrderApi = async (id: string) => {
  return axiosInstance.post(`${getOrderBasePath()}/orders/${id}/cancel`);
};

export const markOrderPaidApi = async (id: string) => {
  return axiosInstance.post(`${getOrderBasePath()}/orders/${id}/mark-paid`);
};
