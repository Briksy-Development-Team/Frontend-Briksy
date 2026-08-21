export type CouponStatus = "active" | "inactive" | "expired";
export type CouponDiscountType = "fixed" | "percentage";

export type Coupon = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  discount_type: CouponDiscountType;
  discount_value: string;
  max_discount_amount?: string | null;
  min_order_amount?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
  usage_limit?: number | null;
  usage_count?: number;
  per_user_limit?: number | null;
  status: CouponStatus;
  created_at?: string;
  updated_at?: string;
};

export type CouponFormValues = {
  code: string;
  name: string;
  description?: string | null;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_discount_amount?: number | null;
  min_order_amount?: number | null;
  starts_at?: string | null;
  expires_at?: string | null;
  usage_limit?: number | null;
  per_user_limit?: number | null;
  status?: CouponStatus;
};

export type CouponValidationValues = {
  code: string;
  amount: number;
  user_id?: string | null;
  organization_id?: string | null;
};
