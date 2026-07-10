import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { PropertyList } from "./property.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const propertyListConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: any; value: any }) => value || row.original?.generated_id || row.original?.id || "—",
    },
    {
      Header: "Title",
      accessor: "title",
      sortable: true,
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Status",
      accessor: "status",
      sortable: true,
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Organization",
      accessor: "organization",
      Cell: ({ value }: { value: any }) => value?.name ?? "—",
    },
    {
      Header: "Suburb",
      accessor: "suburb",
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Postcode",
      accessor: "postcode",
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Rating",
      accessor: "rating",
      sortable: true,
      Cell: ({ value }: { value: any }) => (value !== undefined ? Number(value).toFixed(2) : "—"),
    },
    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
      Cell: ({ value }: { value: any }) => safeDate(value),
    },
  ] satisfies Column<PropertyList>[],

  filters: [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: ["Draft", "Pending Review", "Approved", "Rejected", "Published", "Archived"],
    },
    {
      key: "created_at",
      label: "Created Date",
      type: "dateRange" as const,
    },
  ],

  addAction: null,
  rowActions: [],
};
