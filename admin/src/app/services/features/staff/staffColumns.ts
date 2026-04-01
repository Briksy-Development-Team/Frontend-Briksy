import { EntityColumn } from "../../../modules/apps/shared_table/entity-list/EntityList";

export type Staff = {
  id: number;
  name: string;
  email: string;
  status?: string;
  organization?: { name?: string };
  created_at?: string;
  updated_at?: string;
};

export const staffColumns: EntityColumn<Staff>[] = [
  { Header: "ID", accessor: "id", sortable: true, alwaysVisible: true },
  { Header: "Name", accessor: "name", sortable: true },
  { Header: "Email", accessor: "email", sortable: true },
  { Header: "Status", accessor: "status", sortable: true },
  { Header: "Organization", accessor: (row: Staff) => row.organization?.name ?? "", sortable: false },
  {
    Header: "Created At",
    accessor: "created_at",
    sortable: true,
    Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "—"),
  },
  {
    Header: "Updated At",
    accessor: "updated_at",
    sortable: true,
    Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "—"),
  },
];
