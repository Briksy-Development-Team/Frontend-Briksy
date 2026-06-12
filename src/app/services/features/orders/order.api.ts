import axiosInstance from "../../api/axiosInstance";
import type { Order, OrderFormValues } from "./order.types";

type ApiEnvelope = {
  success: boolean;
  message: string;
  data: Order | Order[];
};

const path = (scope: "admin" | "super-admin") => `/${scope}/orders`;

export const fetchOrdersApi = async (scope: "admin" | "super-admin"): Promise<Order[]> => {
  const response = await axiosInstance.get<ApiEnvelope>(path(scope));
  return Array.isArray(response.data.data) ? (response.data.data as Order[]) : [];
};

export const createOrderApi = async (scope: "admin" | "super-admin", payload: OrderFormValues): Promise<Order> => {
  const response = await axiosInstance.post<ApiEnvelope>(path(scope), payload);
  return response.data.data as Order;
};

export const updateOrderApi = async (
  scope: "admin" | "super-admin",
  id: string,
  payload: OrderFormValues,
): Promise<Order> => {
  const response = await axiosInstance.patch<ApiEnvelope>(`${path(scope)}/${id}`, payload);
  return response.data.data as Order;
};

export const cancelOrderApi = async (scope: "admin" | "super-admin", id: string): Promise<Order> => {
  const response = await axiosInstance.post<ApiEnvelope>(`${path(scope)}/${id}/cancel`);
  return response.data.data as Order;
};

export const markOrderPaidApi = async (id: string): Promise<Order> => {
  const response = await axiosInstance.post<ApiEnvelope>(`/super-admin/orders/${id}/mark-paid`);
  return response.data.data as Order;
};

export const deleteOrderApi = async (scope: "admin" | "super-admin", id: string): Promise<void> => {
  await axiosInstance.delete(`${path(scope)}/${id}`);
};
