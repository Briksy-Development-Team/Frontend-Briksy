import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";

export const propertyDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "name",
    subtitleAccessor: "address",
    badges: [
      {
        label: "status",
        color: (data) => (data.status === "active" ? "success" : "warning"),
      },
      {
        label: "property_type",
        color: "primary",
      }
    ],
    metrics: [
      {
        label: "Price",
        valueAccessor: (data) => `$${data.price?.toLocaleString() || "N/A"}`,
      },
      {
        label: "Size",
        valueAccessor: (data) => `${data.size || "N/A"} sqft`,
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["property_info", "builder_info", "map_view"],
    },
    {
      id: "gallery",
      label: "Gallery",
      sections: ["property_gallery", "video_gallery"],
    },
    {
      id: "inquiries",
      label: "Inquiries",
      sections: ["property_inquiries"],
    },
    {
      id: "activity",
      label: "Activity",
      sections: ["activity_timeline"],
    },
  ],
  sections: [
    {
      id: "property_info",
      type: "info",
      title: "Property Information",
      gridColumnSpan: 6,
      fields: [
        { label: "Name", accessor: "name", colSpan: 6 },
        { label: "Address", accessor: "address", colSpan: 6 },
        { label: "City", accessor: "city", colSpan: 6 },
        { label: "Zip Code", accessor: "zip_code", colSpan: 6 },
        { label: "Bedrooms", accessor: "bedrooms", colSpan: 6 },
        { label: "Bathrooms", accessor: "bathrooms", colSpan: 6 },
        { label: "Year Built", accessor: "year_built", colSpan: 6 },
      ],
    },
    {
      id: "builder_info",
      type: "info",
      title: "Builder Information",
      gridColumnSpan: 6,
      fields: [
        { label: "Builder Name", accessor: "builder_name", colSpan: 6 },
        { label: "Contact", accessor: "builder_contact", colSpan: 6 },
      ],
    },
    {
      id: "map_view",
      type: "map",
      title: "Location Map",
      gridColumnSpan: 12,
      latAccessor: "latitude",
      lngAccessor: "longitude",
    },
    {
      id: "property_gallery",
      type: "gallery",
      title: "Image Gallery",
      gridColumnSpan: 12,
      imagesAccessor: "images",
    },
    {
      id: "video_gallery",
      type: "gallery",
      title: "Video Gallery",
      gridColumnSpan: 12,
      imagesAccessor: "videos",
    },
    {
      id: "property_inquiries",
      type: "table",
      title: "Related Inquiries",
      gridColumnSpan: 12,
      fetchFn: () => {}, 
      dataSelector: () => [], 
      totalSelector: () => 0, 
      columns: [], 
    },
    {
      id: "activity_timeline",
      type: "timeline",
      title: "Status History",
      gridColumnSpan: 12,
    },
  ],
};