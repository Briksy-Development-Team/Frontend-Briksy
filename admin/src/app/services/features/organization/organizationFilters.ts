export const organizationFilters = [
  {
    key: "type_slug",
    label: "Organization Type",
    type: "text",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Blocked"],
  },
  {
    key: "created_at",
    label: "Created Date",
    type: "dateRange",
  },
];
