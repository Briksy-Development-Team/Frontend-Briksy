import type { DetailConfig } from "../../modules/apps/shared_detail/core/DetailTypes";

export const planRequestDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: (data) => data.company_name || "Unknown Company",
    subtitleAccessor: (data) => `Requested by: ${data.contact_name}`,
    avatarAccessor: () => "",
    badges: [
      {
        label: (data: any) => data.status || "Unknown",
        color: (data: any) => data.status === "approved" ? "success" : data.status === "rejected" ? "danger" : "warning"
      }
    ],
    metrics: [
      { label: "Requested Plan", valueAccessor: "requested_plan" },
      { label: "Company Size", valueAccessor: (data) => data.company_size || "N/A" }
    ]
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["request-info", "notes"]
    }
  ],
  sections: [
    {
      id: "request-info",
      type: "info",
      title: "Contact Information",
      fields: [
        { label: "Company Name", accessor: "company_name", colSpan: 6 },
        { label: "Contact Name", accessor: "contact_name", colSpan: 6 },
        { label: "Email", accessor: "email", colSpan: 6 },
        { label: "Phone", accessor: "phone", colSpan: 6 },
        { label: "Requested Plan", accessor: "requested_plan", colSpan: 6 },
      ]
    },
    {
      id: "notes",
      type: "info",
      title: "Notes",
      fields: [
        { label: "Additional Notes", accessor: "notes", colSpan: 12 },
      ]
    }
  ]
};
