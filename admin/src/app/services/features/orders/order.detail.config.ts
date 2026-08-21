import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";

export const orderDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: (data: any) => `Order #${data.order_number}`,
    subtitleAccessor: "company_name",
    avatarAccessor: () => "",
    badges: [
      {
        label: (data: any) => data.status || "Unknown",
        color: (data: any) => data.status === "paid" ? "success" : "warning"
      }
    ],
    metrics: [
      { label: "Amount", valueAccessor: (data: any) => `$${data.amount}` },
      { label: "Plan", valueAccessor: "plan_id" }
    ]
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["order-info"]
    }
  ],
  sections: [
    {
      id: "order-info",
      type: "info",
      title: "Order Details",
      fields: [
        { label: "Order Number", accessor: "order_number", colSpan: 6 },
        { label: "Company Name", accessor: "company_name", colSpan: 6 },
        { label: "Amount", accessor: (data: any) => `$${data.amount}`, colSpan: 6 },
        { label: "Plan ID", accessor: "plan_id", colSpan: 6 },
        { label: "Status", accessor: "status", colSpan: 6 },
      ]
    }
  ]
};
