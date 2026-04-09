import { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Organization } from "./orgr.types";

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

export const OrganizationColumns: Column<Organization>[] = [
  { Header: "ID", accessor: "id", sortable: true, alwaysVisible: true },
  { Header: "Organization", accessor: "name", sortable: true },
  { Header: "Email", accessor: "email", sortable: true },
  { Header: "Status", accessor: "status", sortable: true },

  {
    Header: "Last Login",
    accessor: "last_login",
    sortable: true,
    Cell: ({ value }: any) => formatDate(value),
  },
  {
    Header: "Current Login",
    accessor: "current_login",
    sortable: true,
    Cell: ({ value }: any) => formatDate(value),
  },
  { Header: "Location", accessor: "location", sortable: true },
  {
    Header: "Created At",
    accessor: "created_at",
    sortable: true,
    Cell: ({ value }: any) => formatDate(value),
  },
  {
    Header: "Updated At",
    accessor: "updated_at",
    sortable: true,
    Cell: ({ value }: any) => formatDate(value),
  },
];
