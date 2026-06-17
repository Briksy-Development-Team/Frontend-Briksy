import type { InquiryRequest } from "./inquiry_request.types";

type InquiryRequestApi = InquiryRequest;

export const mapInquiryRequest = (
  item: InquiryRequestApi
): InquiryRequest => ({
  ...item,
});