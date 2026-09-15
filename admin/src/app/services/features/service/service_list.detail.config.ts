import { createElement } from "react";
import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";
import { ServiceAreaMapPreview } from "./component/ServiceAreaMapPreview";
import { getDisplayId } from "../../utils/displayId";

export const serviceDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "name",
    subtitleAccessor: "category",
    badges: [
      {
        label: "status",
        color: (data) => (data.status === "active" ? "success" : "warning"),
      },
      {
        label: () => "Briksy Exclusive",
        color: () => "warning",
        showIf: (data: any) => (data?.organization?.is_briksy_exclusive ?? data?.is_briksy_exclusive ?? true),
      },
    ],
    metrics: [
      {
        label: "Price",
        valueAccessor: (data) => {
          const from = data.rate_from;
          const to = data.rate_to;

          if (from == null && to == null) return "N/A";
          if (from != null && to != null) return `$${from.toLocaleString()} – $${to.toLocaleString()}`;
          return `$${(from ?? to).toLocaleString()}`;
        },
      },
    ],
  },
  tabs: [
      {
        id: "overview",
        label: "Overview",
        sections: ["service_info", "service_area_map", "activity_timeline"],
    },
    {
      id: "gallery",
      label: "Gallery",
      sections: ["service_gallery"],
    },
    {
      id: "inquiries",
      label: "Inquiries",
      sections: ["service_inquiries"],
    },
    {
      id: "emails",
      label: "Emails",
      sections: ["email_history"],
    },
  ],
  sections: [
    {
      id: "service_info",
      type: "info",
      title: "Service Information",
      gridColumnSpan: 8,
      fields: [
        { label: "ID", accessor: (data) => getDisplayId(data), colSpan: 12 },
        { label: "Name", accessor: "name", colSpan: 6 },
        { label: "Category", accessor: "category", colSpan: 6 },
        { label: "Description", accessor: "description", colSpan: 12 },
      ],
    },
    {
      id: "service_area_map",
      type: "custom",
      title: "Service Area Map",
      gridColumnSpan: 12,
      showIf: (data) => Boolean(data?.service_area_geometry || data?.service_area?.trim?.() || data?.service_area),
      component: ({ data }) =>
        createElement(ServiceAreaMapPreview, {
          serviceArea: data?.service_area,
          geometry: data?.service_area_geometry ?? null,
        }),
    },
    {
      id: "activity_timeline",
      type: "timeline",
      title: "Recent Activity",
      gridColumnSpan: 4,
    },
    {
      id: "service_gallery",
      type: "gallery",
      title: "Gallery",
      gridColumnSpan: 12,
      imagesAccessor: (data) => (data?.images ?? [])
        .map((image: any) => typeof image === "string" ? image : image?.url)
        .filter(Boolean),
    },
    {
      id: "service_inquiries",
      type: "table",
      title: "Related Inquiries",
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
