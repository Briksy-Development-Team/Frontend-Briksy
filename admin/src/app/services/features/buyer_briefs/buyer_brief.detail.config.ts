import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";

export const buyerBriefDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "client_name",
    subtitleAccessor: (data) => data.client_email || "Buyer brief",
    badges: [{ label: (data) => String(data.status || "active").replace(/_/g, " "), color: "primary" }],
    metrics: [{ label: "Budget", valueAccessor: (data) => [data.budget_min, data.budget_max].some(Boolean) ? `$${Number(data.budget_min ?? 0).toLocaleString()} – $${Number(data.budget_max ?? 0).toLocaleString()}` : "—" }],
  },
  tabs: [{ id: "overview", label: "Overview", sections: ["brief_info", "preferences", "notes"] }],
  sections: [
    { id: "brief_info", type: "info", title: "Client Details", gridColumnSpan: 8, fields: [
      { label: "Client name", accessor: "client_name", colSpan: 6 },
      { label: "Email", accessor: (data) => data.client_email || "—", colSpan: 6 },
      { label: "Status", accessor: (data) => String(data.status || "active").replace(/_/g, " "), colSpan: 6 },
      { label: "Preferred areas", accessor: (data) => data.preferred_locations?.join(", ") || "—", colSpan: 6 },
    ] },
    { id: "preferences", type: "info", title: "Property Preferences", gridColumnSpan: 8, fields: [
      { label: "Property type", accessor: (data) => data.preferences?.property_type || "—", colSpan: 6 },
      { label: "Bedrooms", accessor: (data) => data.preferences?.bedrooms || "—", colSpan: 6 },
    ] },
    { id: "notes", type: "info", title: "Notes", gridColumnSpan: 8, fields: [{ label: "Client requirements", accessor: (data) => data.notes || "No notes added.", colSpan: 12 }] },
  ],
};
