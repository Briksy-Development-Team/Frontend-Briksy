import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";
import { getDisplayId } from "../../utils/displayId";

export const inquiryDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: (data) => data?.subject || "Enquiry",
    subtitleAccessor: (data) => getDisplayId(data),
    badges: [
      {
        label: "status",
        color: (data) => (data?.status === "new" ? "warning" : "success"),
      },
    ],
    metrics: [
      {
        label: "Lead Source",
        valueAccessor: (data) => data?.lead_source ?? "—",
      },
      {
        label: "Created",
        valueAccessor: (data) => data?.created_at ?? "—",
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["inquiry_info", "property_info", "message"],
    },
  ],
  sections: [
    {
      id: "inquiry_info",
      type: "info",
      title: "Enquiry Details",
      gridColumnSpan: 6,
      fields: [
        { label: "ID", accessor: (data) => getDisplayId(data), colSpan: 12 },
        { label: "Customer Name", accessor: "seeker_name", colSpan: 6 },
        { label: "Customer Email", accessor: "seeker_email", colSpan: 6 },
        { label: "Customer Phone", accessor: "seeker_phone", colSpan: 6 },
        { label: "Status", accessor: "status", colSpan: 6 },
      ],
    },
    {
      id: "property_info",
      type: "info",
      title: "Property / Company",
      gridColumnSpan: 6,
      fields: [
        { label: "Property", accessor: "property_title", colSpan: 12 },
        { label: "Address", accessor: "property_address", colSpan: 12 },
        { label: "Company", accessor: "organization_name", colSpan: 12 },
      ],
    },
    {
      id: "message",
      type: "info",
      title: "Message",
      gridColumnSpan: 12,
      fields: [
        { label: "Subject", accessor: "subject", colSpan: 12 },
        { label: "Message", accessor: "message", colSpan: 12 },
      ],
    },
  ],
};
