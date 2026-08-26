import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";

export const couponDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "code",
    subtitleAccessor: (data: any) => `Type: ${data.discount_type}`,
    avatarAccessor: () => "",
    badges: [
      {
        label: (data: any) => data.is_active ? "Active" : "Inactive",
        color: (data: any) => data.is_active ? "success" : "secondary"
      }
    ],
    metrics: [
      { label: "Discount", valueAccessor: "discount_value" },
      { label: "Max Uses", valueAccessor: (data: any) => data.usage_limit || "Unlimited" }
    ]
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["coupon-info"]
    }
  ],
  sections: [
    {
      id: "coupon-info",
      type: "info",
      title: "Coupon Details",
      fields: [
        { label: "Code", accessor: "code", colSpan: 6 },
        { label: "Type", accessor: "discount_type", colSpan: 6 },
        { label: "Value", accessor: "discount_value", colSpan: 6 },
        { label: "Valid From", accessor: "valid_from", colSpan: 6 },
        { label: "Valid Until", accessor: "valid_until", colSpan: 6 },
        { label: "Usage Limit", accessor: "usage_limit", colSpan: 6 },
      ]
    }
  ]
};
