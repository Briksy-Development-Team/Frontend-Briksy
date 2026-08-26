import type { Order } from "./order.types";

type OrderApi = Order;

export const mapOrder = (
  item: OrderApi
): Order => ({
  ...item,
});