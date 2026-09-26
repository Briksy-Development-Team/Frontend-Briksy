import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { BuilderProject } from "./builder_project.types";
import { formatDateTime } from "../../utils/dateFormat";
import { getDisplayId } from "../../utils/displayId";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const builderProjectConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: any; value: any }) => value || getDisplayId(row),
    },
    {
      Header: "Project Name",
      accessor: "name",
      sortable: true,
    },
    {
      Header: "Type",
      accessor: "project_type",
      sortable: true,
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Status",
      accessor: "status",
      sortable: true,
      Cell: ({ value }: { value: any }) => {
        const statusVal = value || "Pending Review";
        const label = statusVal.replace(/_/g, " ");
        const badgeClass =
            statusVal === "Published"
            ? "badge-light-success"
            : statusVal === "Rejected"
            ? "badge-light-danger"
            : statusVal === "Pending Review"
            ? "badge-light-info"
            : statusVal === "completed"
            ? "badge-light-success"
            : statusVal === "in_delivery"
            ? "badge-light-primary"
            : "badge-light-warning";
        return (
          <span className={`badge ${badgeClass} fw-bold text-capitalize`}>
            {label}
          </span>
        );
      },
    },
    {
      Header: "Location",
      accessor: "location",
      sortable: true,
      Cell: ({ row }: { row: any }) =>
        [row.location, row.state].filter(Boolean).join(", ") || "—",
    },
    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
      Cell: ({ value }: { value: any }) => safeDate(value),
    },
  ] satisfies Column<BuilderProject>[],

  filters: [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending Review", value: "Pending Review" },
        { label: "Published", value: "Published" },
        { label: "Rejected", value: "Rejected" },
        { label: "Planning", value: "planning" },
        { label: "In Delivery", value: "in_delivery" },
        { label: "Completed", value: "completed" },
      ],
    },
    {
      key: "created_at",
      label: "Created Date",
      type: "dateRange",
    },
  ],
  storageKey: "builderProjectsColumns",
};
