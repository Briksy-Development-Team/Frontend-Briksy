export const staffFilters = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive", "Blocked"],
  },
  {
    key: "organization_id",
    label: "Organization",
    type: "text",
  },
  {
    key: "created_at",
    label: "Created Date",
    type: "dateRange",
  },
];
