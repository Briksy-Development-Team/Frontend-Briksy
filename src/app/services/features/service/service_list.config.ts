import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { ServiceList } from "./service_list.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const serviceListConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: any; value: any }) => value || row.original?.generated_id || row.original?.id || "—",
    },
    {
      Header: "Name",
      accessor: "name",
      sortable: true,
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Slug",
      accessor: "slug",
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Title",
      accessor: "title",
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Status",
      accessor: "is_active",
      Cell: ({ value }: { value: any }) => (value ? "Active" : "Inactive"),
    },
    {
      Header: "Organization Type",
      accessor: "organization_type",
      Cell: ({ value }: { value: any }) => value?.name ?? "—",
    },
    {
      Header: "Service Area",
      accessor: "service_area",
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Rate From",
      accessor: "rate_from",
      Cell: ({ value }: { value: any }) => (value ?? "—"),
    },
    {
      Header: "Rate To",
      accessor: "rate_to",
      Cell: ({ value }: { value: any }) => (value ?? "—"),
    },
    {
      Header: "Organizations Count",
      accessor: "organization_count",
      sortable: true,
      Cell: ({ value }: { value: any }) => value ?? 0,
    },
    {
      Header: "Service Groups Count",
      accessor: "service_group_count",
      sortable: true,
      Cell: ({ value }: { value: any }) => value ?? 0,
    },
    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
      Cell: ({ value }: { value: any }) => safeDate(value),
    },
  ] satisfies Column<ServiceList>[],

  filters: [
    {
      key: "created_at",
      label: "Created Date",
      type: "dateRange" as const,
    },
  ],

  addAction: null,
  rowActions: [],
};
