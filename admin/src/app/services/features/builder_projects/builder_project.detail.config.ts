import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";
import { getDisplayId } from "../../utils/displayId";

export const builderProjectDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "name",
    subtitleAccessor: (data: any) => data.project_type || "Builder Project",
    badges: [
      {
        label: (data: any) => {
          const status = String(data?.status ?? "Pending Review").replace(/_/g, " ");
          return status.charAt(0).toUpperCase() + status.slice(1);
        },
        color: (data: any) => {
          const status = String(data?.status ?? "").toLowerCase();
          if (status === "published") return "success";
          if (status === "rejected") return "danger";
          if (status === "pending review") return "info";
          if (status === "completed") return "success";
          if (status === "in_delivery") return "primary";
          return "warning";
        },
      },
    ],
    metrics: [
      {
        label: "Location",
        valueAccessor: (data: any) =>
          [data.location, data.state, data.postcode].filter(Boolean).join(", ") || "—",
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["project_info", "project_map", "recent_activity"],
    },
    {
      id: "media",
      label: "Media",
      sections: ["project_images", "project_videos"],
      showIf: (data: any) => (data?.images?.length ?? 0) > 0 || (data?.videos?.length ?? 0) > 0,
    },
  ],
  sections: [
    {
      id: "project_info",
      type: "info",
      title: "Project Details",
      gridColumnSpan: 8,
      fields: [
        { label: "ID", accessor: (data: any) => getDisplayId(data), colSpan: 6 },
        { label: "Project Name", accessor: "name", colSpan: 6 },
        { label: "Project Type", accessor: (data: any) => data.project_type || "—", colSpan: 6 },
        { label: "Status", accessor: (data: any) => (data.status || "Pending Review").replace(/_/g, " "), colSpan: 6 },
        { label: "Suburb / Location", accessor: (data: any) => data.location || "—", colSpan: 6 },
        { label: "State", accessor: (data: any) => data.state || "—", colSpan: 3 },
        { label: "Postcode", accessor: (data: any) => data.postcode || "—", colSpan: 3 },
        { label: "Description", accessor: (data: any) => data.description || "No description provided.", colSpan: 12 },
      ],
    },
    {
      id: "project_map",
      type: "map",
      title: "Project Location",
      gridColumnSpan: 8,
      showIf: (data: any) => data?.latitude !== null && data?.latitude !== undefined && data?.longitude !== null && data?.longitude !== undefined,
      latAccessor: "latitude",
      lngAccessor: "longitude",
    },
    {
      id: "project_images",
      type: "gallery",
      title: "Project Images",
      gridColumnSpan: 12,
      showIf: (data: any) => (data?.images?.length ?? 0) > 0,
      imagesAccessor: (data: any) => (data?.images ?? []).map((image: any) => image.url).filter(Boolean),
    },
    {
      id: "project_videos",
      type: "gallery",
      title: "Project Videos",
      gridColumnSpan: 12,
      showIf: (data: any) => (data?.videos?.length ?? 0) > 0,
      mediaType: "video",
      imagesAccessor: (data: any) => (data?.videos ?? []).map((video: any) => video.url).filter(Boolean),
    },
    {
      id: "recent_activity",
      type: "timeline",
      title: "Activity Timeline",
      gridColumnSpan: 4,
    },
  ],
};
