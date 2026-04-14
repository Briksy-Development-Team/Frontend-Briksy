import { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Seeker } from "./seeker.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const seekerColumns: Column<Seeker>[] = [
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
    Header: "Email",
    accessor: "email",
    sortable: true,
  },

  {
    Header: "Mobile",
    accessor: "mobile_number",
  },

  {
    Header: "Organization ID",
    accessor: "organization_id",
  },

  {
    Header: "Roles",
    accessor: "roles",
    Cell: (value) => (Array.isArray(value) ? value.join(", ") : "—"),
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
];
