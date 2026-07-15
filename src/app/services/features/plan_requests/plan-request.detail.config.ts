import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";
import type { PlanRequest } from "./plan-request.types";
import { getDisplayId } from "../../utils/displayId";

export const planRequestDetailConfig: DetailConfig<PlanRequest> = {
  header: {
    titleAccessor: (data) => data.company_name ?? data.contact_name ?? "Unknown Company",
    subtitleAccessor: (data) =>
      data.contact_email ? `Requested by: ${data.contact_email}` : "Plan request details",
    avatarAccessor: () => "",
    badges: [
      {
        label: (data) => data.status || "Unknown",
        color: (data) =>
          data.status === "approved"
            ? "success"
            : data.status === "rejected"
              ? "danger"
              : "warning",
      },
    ],
    metrics: [
      { label: "Requested Plan", valueAccessor: "requested_plan_name" },
      { label: "Billing Cycle", valueAccessor: "billing_cycle" },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["request-info", "notes"],
    },
  ],
  sections: [
    {
      id: "request-info",
      type: "info",
      title: "Contact Information",
      fields: [
        { label: "ID", accessor: (data) => getDisplayId(data), colSpan: 6 },
        { label: "Company Name", accessor: "company_name", colSpan: 6 },
        { label: "Contact Name", accessor: "contact_name", colSpan: 6 },
        { label: "Email", accessor: "contact_email", colSpan: 6 },
        { label: "Phone", accessor: "contact_phone", colSpan: 6 },
        { label: "Requested Plan", accessor: "requested_plan_name", colSpan: 6 },
        { label: "Billing Cycle", accessor: "billing_cycle", colSpan: 6 },
        { label: "Organization", accessor: (data) => data.organization?.name ?? "—", colSpan: 6 },
      ],
    },
    {
      id: "notes",
      type: "info",
      title: "Notes",
      fields: [
        { label: "Additional Notes", accessor: "message", colSpan: 12 },
        { label: "Admin Notes", accessor: "admin_notes", colSpan: 12 },
      ],
    },
  ],
};
