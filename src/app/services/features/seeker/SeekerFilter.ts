export const seekerFilters = [
  {
    key: "email_verified",
    label: "Email Status",
    type: "select",
    options: [
      { label: "Verified", value: 1 },
      { label: "Not Verified", value: 0 },
    ],
  },
  {
    key: "mobile_verified",
    label: "Mobile Status",
    type: "select",
    options: [
      { label: "Verified", value: 1 },
      { label: "Not Verified", value: 0 },
    ],
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Seeker", value: "seeker" },
      { label: "Admin", value: "admin" },
    ],
  },
  {
    key: "created_at",
    label: "Created Date",
    type: "dateRange",
  },
];
