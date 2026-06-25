import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";
import type { Seeker } from "./seeker.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const seekerDetailConfig: DetailConfig<Seeker> = {
  header: {
    titleAccessor: "name",
    subtitleAccessor: "email",
    avatarAccessor: "display_name", // We don't have an avatar URL in Seeker type, fallback to initials
    badges: [
      {
        label: () => "Seeker",
        color: "primary",
      },
      {
        label: (data) => (data.email_verified_at ? "Verified" : "Unverified"),
        color: (data) => (data.email_verified_at ? "success" : "warning"),
      },
    ],
    metrics: [
      {
        label: "Registered",
        valueAccessor: (data) => safeDate(data.created_at),
      },
      {
        label: "Phone",
        valueAccessor: (data) => data.mobile_number || "N/A",
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["personal_info", "recent_activity"],
    },
    {
      id: "inquiries",
      label: "Property Inquiries",
      sections: ["property_inquiries"],
    },
    {
      id: "emails",
      label: "Email History",
      sections: ["email_history"],
    },
    {
      id: "notes",
      label: "Notes",
      sections: ["admin_notes"],
    },
  ],
  sections: [
    {
      id: "personal_info",
      type: "info",
      title: "Personal Information",
      gridColumnSpan: 8,
      fields: [
        { label: "Full Name", accessor: "name", colSpan: 6 },
        { label: "Display Name", accessor: "display_name", colSpan: 6 },
        { label: "Email Address", accessor: "email", colSpan: 6 },
        { label: "Mobile Number", accessor: "mobile_number", colSpan: 6 },
        { label: "Organization ID", accessor: "organization_id", colSpan: 6 },
        { 
          label: "Roles", 
          accessor: (data) => data.roles?.join(", ") || "None", 
          colSpan: 6 
        },
      ],
    },
    {
      id: "recent_activity",
      type: "timeline",
      title: "Activity Timeline",
      gridColumnSpan: 4,
    },
    {
      id: "property_inquiries",
      type: "table",
      title: "Related Inquiries",
      fetchFn: () => {}, // Mock for now until API is built
      dataSelector: () => [], // Mock
      totalSelector: () => 0, // Mock
      columns: [], // Mock
    },
    {
      id: "email_history",
      type: "emails",
      title: "Emails",
    },
    {
      id: "admin_notes",
      type: "notes",
      title: "Internal Notes",
    },
  ],
};