import { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Seeker } from "./seeker.types";

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const normalized = value.includes(" ") ? value.replace(" ", "T") : value;

  const date = new Date(normalized);
  if (isNaN(date.getTime())) return "—";

  const absolute = date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  let relative = "";
  if (diffDay > 0) relative = `${diffDay}d ago`;
  else if (diffHr > 0) relative = `${diffHr}h ago`;
  else relative = `${diffMin}m ago`;

  return `${absolute} (${relative})`;
};

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
    Header: "Roles",
    accessor: "roles",
    Cell: ({ value }: { value: string[] }) =>
      Array.isArray(value) ? value.join(", ") : "—",
  },

  {
    Header: "Email Verified",
    accessor: "email_verified_at",
    sortable: true,
    Cell: ({ value }) => formatDateTime(value),
  },

  {
    Header: "Mobile Verified",
    accessor: "mobile_verified_at",
    sortable: true,
    Cell: ({ value }) => formatDateTime(value),
  },

  {
    Header: "Created At",
    accessor: "created_at",
    sortable: true,
    Cell: ({ value }) => formatDateTime(value),
  },
];
