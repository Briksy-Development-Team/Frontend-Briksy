import type { Coupon } from "./coupon.types";

type CouponApi = Coupon;

export const mapCoupon = (item: CouponApi): Coupon => ({
  ...item,
});
