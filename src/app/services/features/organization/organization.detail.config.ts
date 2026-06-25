import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";

export const organizationDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "name",
    subtitleAccessor: "industry",
    badges: [
      {
        label: "status",
        color: (data) => (data.status === "active" ? "success" : "warning"),
      }
    ],
    metrics: [
      {
        label: "Staff Members",
        valueAccessor: (data) => data.staff_count || 0,
      },
      {
        label: "Total Properties",
        valueAccessor: (data) => data.property_count || 0,
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["company_info", "activity_timeline"],
    },
    {
      id: "staff",
      label: "Staff",
      sections: ["staff_members"],
    },
    {
      id: "properties",
      label: "Properties",
      sections: ["properties_table"],
    },
    {
      id: "services",
      label: "Services",
      sections: ["services_table"],
    },
    {
      id: "emails",
      label: "Emails",
      sections: ["email_history"],
    },
  ],
  sections: [
    {
      id: "company_info",
      type: "info",
      title: "Company Information",
      gridColumnSpan: 8,
      fields: [
        { label: "Company Name", accessor: "name", colSpan: 6 },
        { label: "Registration No.", accessor: "registration_number", colSpan: 6 },
        { label: "Email", accessor: "email", colSpan: 6 },
        { label: "Phone", accessor: "phone", colSpan: 6 },
        { label: "Website", accessor: "website", colSpan: 6 },
        { label: "Address", accessor: "address", colSpan: 6 },
      ],
    },
    {
      id: "activity_timeline",
      type: "timeline",
      title: "Recent Activity",
      gridColumnSpan: 4,
    },
    {
      id: "staff_members",
      type: "table",
      title: "Staff Members",
      gridColumnSpan: 12,
      fetchFn: () => {}, 
      dataSelector: () => [], 
      totalSelector: () => 0, 
      columns: [], 
    },
    {
      id: "properties_table",
      type: "table",
      title: "Properties",
      gridColumnSpan: 12,
      fetchFn: () => {}, 
      dataSelector: () => [], 
      totalSelector: () => 0, 
      columns: [], 
    },
    {
      id: "services_table",
      type: "table",
      title: "Services",
      gridColumnSpan: 12,
      fetchFn: () => {}, 
      dataSelector: () => [], 
      totalSelector: () => 0, 
      columns: [], 
    },
    {
      id: "email_history",
      type: "emails",
      title: "Email History",
      gridColumnSpan: 12,
    },
  ],
};