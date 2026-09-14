import type { Inquiry } from "./inquiry.types";

export const mapInquiry = (item: Inquiry): Inquiry => ({
  ...item,
  display_id: item.reference_no ?? item.display_id ?? item.id,
});
