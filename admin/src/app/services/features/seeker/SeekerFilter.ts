export const seekerFilters = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive", "Blocked"],
  },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female"],
  },
  {
    key: "age",
    label: "Age",
    type: "range",
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
