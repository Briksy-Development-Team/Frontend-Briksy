export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";
export type OrderStatus = "draft" | "confirmed" | "active" | "expired" | "cancelled";

export type Order = {
  id: string;
  order_number: string;
  organization_id?: string | null;
  user_id?: string | null;
  plan_id?: string | null;
  coupon_id?: string | null;
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  total_amount: string;
  currency: string;
  billing_cycle?: string | null;
  payment_status: OrderPaymentStatus;
  order_status: OrderStatus;
  payment_method?: string | null;
  transaction_reference?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  organization?: { id: string; name: string };
  user?: { id: string; name: string; email: string };
  plan?: { id: string; name: string };
  coupon?: { id: string; code: string; discount_type: string };
};

export type OrderFormValues = {
  organization_id?: string | null;
  user_id?: string | null;
  plan_id?: string | null;
  coupon_id?: string | null;
  coupon_code?: string | null;
  subtotal: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount?: number;
  currency?: string;
  billing_cycle?: string | null;
  payment_status?: OrderPaymentStatus;
  order_status?: OrderStatus;
  payment_method?: string | null;
  transaction_reference?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  notes?: string | null;
};

export type OrderCancelValues = {
  reason?: string;
};
