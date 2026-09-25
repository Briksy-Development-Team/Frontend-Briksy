import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";

export const offerDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "title",
    subtitleAccessor: (data: any) =>
      data.property_listing?.title
        ? `Property: ${data.property_listing.title}`
        : `Property Listing ID: ${data.property_listing_id ?? "—"}`,
    avatarAccessor: () => "",
    badges: [
      {
        label: (data: any) => (data?.is_active ? "Active" : "Inactive"),
        color: (data: any) => (data?.is_active ? "success" : "danger"),
      },
      {
        label: (data: any) => data?.tag_label ?? "BRIKSY EXCLUSIVE",
        color: () => "primary",
      },
    ],
    metrics: [
      { label: "Sort Order", valueAccessor: (data: any) => data?.sort_order ?? 0 },
      {
        label: "Highlights",
        valueAccessor: (data: any) =>
          Array.isArray(data?.highlights) ? data.highlights.length : 0,
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["offer-info", "highlights-info", "terms-info"],
    },
  ],
  sections: [
    {
      id: "offer-info",
      type: "info",
      title: "Offer Information",
      fields: [
        { label: "Title", accessor: "title", colSpan: 6 },
        { label: "Tag Label", accessor: (d: any) => d.tag_label ?? "BRIKSY EXCLUSIVE", colSpan: 6 },
        {
          label: "Property Title",
          accessor: (d: any) => d.property_listing?.title ?? d.property_listing_id ?? "—",
          colSpan: 6,
        },
        { label: "Sort Order", accessor: "sort_order", colSpan: 6 },
        { label: "Summary", accessor: "summary", colSpan: 12 },
        { label: "Description", accessor: "description", colSpan: 12 },
      ],
    },
    {
      id: "highlights-info",
      type: "info",
      title: "What's Included / Highlights",
      fields: [
        {
          label: "Highlights",
          accessor: (d: any) =>
            Array.isArray(d.highlights) && d.highlights.length > 0
              ? d.highlights.join("\n")
              : "No highlights specified.",
          colSpan: 12,
        },
      ],
    },
    {
      id: "terms-info",
      type: "info",
      title: "Terms & Conditions",
      fields: [
        { label: "Terms", accessor: (d: any) => d.terms ?? "No terms specified.", colSpan: 12 },
      ],
    },
  ],
};
