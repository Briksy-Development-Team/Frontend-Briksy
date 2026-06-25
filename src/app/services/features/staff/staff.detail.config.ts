import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";

export const staffDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "name",
    subtitleAccessor: "email",
    badges: [
      {
        label: "Staff",
        color: "primary",
      },
      {
        label: (data) => (data.email_verified_at ? "Verified" : "Unverified"),
        color: (data) => (data.email_verified_at ? "success" : "warning"),
      },
    ],
    metrics: [
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
      id: "permissions",
      label: "Permissions",
      sections: ["roles_permissions"],
    },
    {
      id: "emails",
      label: "Email History",
      sections: ["email_history"],
    },
  ],
  sections: [
    {
      id: "personal_info",
      type: "info",
      title: "Staff Information",
      gridColumnSpan: 8,
      fields: [
        { label: "Full Name", accessor: "name", colSpan: 6 },
        { label: "Email", accessor: "email", colSpan: 6 },
        { label: "Mobile Number", accessor: "mobile_number", colSpan: 6 },
        { label: "Organization ID", accessor: "organization_id", colSpan: 6 },
      ],
    },
    {
      id: "recent_activity",
      type: "timeline",
      title: "Activity Timeline",
      gridColumnSpan: 4,
    },
    {
      id: "roles_permissions",
      type: "info",
      title: "Roles & Permissions",
      gridColumnSpan: 12,
      fields: [
        { 
          label: "Assigned Roles", 
          accessor: (data) => data.roles?.join(", ") || "None", 
          colSpan: 12 
        },
      ],
    },
    {
      id: "email_history",
      type: "emails",
      title: "Email History",
    },
  ],
};