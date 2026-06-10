import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Staff } from "./staff.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const staffConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "id",
      sortable: true,
      alwaysVisible: true,
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
      Header: "Organization ID",
      accessor: "organization_id",
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
      Header: "Roles",
      accessor: "roles",
      Cell: ({ value }) =>
        Array.isArray(value) ? (value as string[]).join(", ") : "—",
    },

    {
      Header: "Email Verified",
      accessor: "email_verified_at",
      sortable: true,
      Cell: ({ value }) => safeDate(value),
    },

    {
      Header: "Mobile Verified",
      accessor: "mobile_verified_at",
      sortable: true,
      Cell: ({ value }) => safeDate(value),
    },

    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
      Cell: ({ value }) => safeDate(value),
    },
  ] satisfies Column<Staff>[],

  filters: [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Active", "Inactive", "Blocked"],
    },

    {
      key: "created_at",
      label: "Created Date",
      type: "dateRange",
    },
    {
      key: "updated_at",
      label: "Updated Date",
      type: "dateRange",
    },
  ],
  addAction: { label: "Add Staff" },
  rowActions: [{ label: "Edit" }],
};
