import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Seeker } from "./seeker.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const seekerConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: any; value: any }) => {
        if (value) {
          return value;
        }

        const index = Number(row?.index ?? 0) + 1;
        return `USR-${String(index).padStart(3, "0")}`;
      },
    },
    {
      Header: "Name",
      accessor: "name",
      sortable: true,
    },
    {
      Header: "Display Name",
      accessor: "display_name",
      sortable: true,
    },
    {
      Header: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      Header: "Mobile",
      accessor: "mobile_number",
    },
    {
      Header: "Email Verified",
      accessor: "email_verified_at",
      sortable: true,
      Cell: ({ value }: { value: any }) => safeDate(value),
    },
    {
      Header: "Mobile Verified",
      accessor: "mobile_verified_at",
      sortable: true,
      Cell: ({ value }: { value: any }) => safeDate(value),
    },
    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
      Cell: ({ value }: { value: any }) => safeDate(value),
    },
  ] satisfies Column<Seeker>[],

  filters: [
    {
      key: "email_verified",
      label: "Email Status",
      type: "select" as const,
      options: [
        { label: "Verified", value: 1 },
        { label: "Not Verified", value: 0 },
      ],
    },
    {
      key: "mobile_verified",
      label: "Mobile Status",
      type: "select" as const,
      options: [
        { label: "Verified", value: 1 },
        { label: "Not Verified", value: 0 },
      ],
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
