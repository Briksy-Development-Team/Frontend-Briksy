import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";
import { getDisplayId } from "../../utils/displayId";

export const propertyDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "title",
    subtitleAccessor: (data) => data?.full_address ?? data?.address ?? "—",
    badges: [
      {
        label: "status",
        color: (data) => {
          if (data?.status === "Published" || data?.status === "Approved") return "success";
          if (data?.status === "Rejected") return "danger";
          if (data?.status === "Archived") return "secondary";
          if (data?.status === "Pending Review") return "warning";
          return "warning";
        },
      },
      {
        label: (data) => (data?.location_verified ? "Location verified" : "Location unverified"),
        color: (data) => (data?.location_verified ? "success" : "warning"),
      },
    ],
    metrics: [
      {
        label: "Latitude",
        valueAccessor: (data) =>
          typeof data?.latitude === "number" ? data.latitude.toFixed(6) : "N/A",
      },
      {
        label: "Longitude",
        valueAccessor: (data) =>
          typeof data?.longitude === "number" ? data.longitude.toFixed(6) : "N/A",
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["property_info", "location_map", "builder_info"],
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
        { label: "ID", accessor: (data) => getDisplayId(data), colSpan: 12 },
        { label: "Title", accessor: "title", colSpan: 6 },
        { label: "Status", accessor: "status", colSpan: 6 },
        { label: "Property Type", accessor: (data) => data?.property_type?.name ?? "—", colSpan: 6 },
        { label: "Address", accessor: "address", colSpan: 6 },
        { label: "Address Line 1", accessor: "address_line_1", colSpan: 6 },
        { label: "Address Line 2", accessor: "address_line_2", colSpan: 6 },
        { label: "Full Address", accessor: "full_address", colSpan: 12 },
        { label: "Formatted Address", accessor: "formatted_address", colSpan: 12 },
        { label: "Suburb", accessor: "suburb", colSpan: 6 },
        { label: "State", accessor: "state", colSpan: 6 },
        { label: "Postcode", accessor: "postcode", colSpan: 6 },
        { label: "Country", accessor: "country", colSpan: 6 },
        { label: "Place ID", accessor: "place_id", colSpan: 12 },
        { label: "Location Verified", accessor: (data) => (data?.location_verified ? "Yes" : "No"), colSpan: 6 },
        { label: "Reviewer", accessor: (data) => data?.reviewer?.name ?? "—", colSpan: 6 },
        { label: "Reviewed On", accessor: (data) => data?.reviewed_at ?? "—", colSpan: 6 },
        { label: "Published On", accessor: (data) => data?.published_at ?? "—", colSpan: 6 },
        { label: "Rejection Reason", accessor: (data) => data?.rejection_reason ?? "—", colSpan: 12 },
      ],
    },
    {
      id: "builder_info",
      type: "info",
      title: "Builder / Organization",
      gridColumnSpan: 6,
      fields: [
        { label: "Organization", accessor: (data) => data?.organization?.name ?? "—", colSpan: 6 },
        { label: "Creator", accessor: (data) => data?.creator?.name ?? "—", colSpan: 6 },
        { label: "Creator Email", accessor: (data) => data?.creator?.email ?? "—", colSpan: 6 },
        { label: "Rating", accessor: (data) => data?.rating ?? "—", colSpan: 6 },
      ],
    },
    {
      id: "location_map",
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
      imagesAccessor: (data) => (Array.isArray(data?.images) ? data.images.map((image: any) => image.url).filter(Boolean) : []),
    },
    {
      id: "video_gallery",
      type: "gallery",
      title: "Video Gallery",
      gridColumnSpan: 12,
      imagesAccessor: (data) => (Array.isArray(data?.videos) ? data.videos.map((video: any) => video.url).filter(Boolean) : []),
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
