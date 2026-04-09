export const SoloFilters = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive", "Blocked"],
  },

 
  {
    key: "created_at",
    label: "Created Date",
    type: "dateRange",
  },
  {
    key: "updated_at",
    label: "Updated Date",
    type: "dateRange",
  },
];
