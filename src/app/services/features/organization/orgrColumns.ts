import { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Organization } from "./orgr.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const OrganizationColumns: Column<Organization>[] = [
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
    Header: "ABN",
    accessor: "abn",
    Cell: ({ value }) => (value ? String(value) : "—"),
  },
  {
    Header: "ACN",
    accessor: "acn",
    Cell: ({ value }) => (value ? String(value) : "—"),
  },
  {
    Header: "Verified",
    accessor: "is_verified",
    Cell: ({ value }) => (value ? "✔ Verified" : "✖ Not Verified"),
  },
  {
    Header: "Rating",
    accessor: "avg_org_rating",
    Cell: ({ value }) => (value ? `⭐ ${value}` : "—"),
  },
  {
    Header: "Seats",
    accessor: "licensed_staff_seats",
    Cell: ({ value }) => (value ? String(value) : "—"),
  },
  {
    Header: "Created At",
    accessor: "created_at",
    sortable: true,
    Cell: ({ value }) => safeDate(value),
  },
];
