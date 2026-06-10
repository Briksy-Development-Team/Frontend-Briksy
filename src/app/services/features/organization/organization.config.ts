// organization.config.ts  ← rename from orgrColumns.ts for clarity

import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Organization } from "./organization.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const organizationConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "id",
      sortable: true,
      alwaysVisible: true,
    },
    {
      Header: "Organization",
      accessor: "name",
      sortable: true,
      Cell: ({ value }) => (value ? String(value) : "—"),
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ value }) => (value as Organization["type"])?.name ?? "—",
    },
    {
      Header: "Email",
      accessor: "contact_email",
      sortable: true,
      Cell: ({ value }) => (value ? String(value) : "—"),
    },
    {
      Header: "Phone",
      accessor: "contact_phone",
      Cell: ({ value }) => (value ? String(value) : "—"),
    },
    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
      Cell: ({ value }) => safeDate(value),
    },
  ] satisfies Column<Organization>[],

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
  ],

  addAction: null, // null = no Add button for this module

  rowActions: [], // [] = no Edit/Delete for view-only modules
};
