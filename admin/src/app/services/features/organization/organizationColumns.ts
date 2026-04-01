import { EntityColumn } from "../../../modules/apps/shared_table/entity-list/EntityList";

export type Organization = {
  id: number;
  name: string;
  email?: string;
  status?: string;
  organization_type?: { name?: string };
  created_at?: string;
};

export const organizationColumns: EntityColumn<Organization>[] = [
  { Header: "ID", accessor: "id", sortable: true, alwaysVisible: true },
  { Header: "Name", accessor: "name", sortable: true },
  { Header: "Email", accessor: "email", sortable: true },
  { Header: "Status", accessor: "status", sortable: true },
  { Header: "Type", accessor: (row: Organization) => row.organization_type?.name ?? "", sortable: true },
  {
    Header: "Created At",
    accessor: "created_at",
    sortable: true,
    Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "—"),
  },
];
