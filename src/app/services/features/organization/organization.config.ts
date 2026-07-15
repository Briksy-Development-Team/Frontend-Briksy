// organization.config.ts  ← rename from orgrColumns.ts for clarity

import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Organization } from "./organization.types";
import { formatDateTime } from "../../utils/dateFormat";
import { getDisplayId } from "../../utils/displayId";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const organizationConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: any; value: any }) => value || getDisplayId(row),
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
      Header: "Business Type",
      accessor: "business_type",
      Cell: ({ value }) => value ? String(value) : "—",
    },
    {
      Header: "Verification",
      accessor: "business_verification_status",
      Cell: ({ value }) => value ? String(value) : "pending",
    },
    {
      Header: "ABN",
      accessor: "abn",
      sortable: true,
      Cell: ({ value }) => (value ? String(value) : "—"),
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
      key: "business_type",
      label: "Business Type",
      type: "select",
      options: ["organisation", "company", "solo_trader"],
    },
    {
      key: "business_verification_status",
      label: "Verification Status",
      type: "select",
      options: ["pending", "verified", "rejected"],
    },
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
