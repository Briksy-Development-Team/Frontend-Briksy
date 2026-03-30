import { Column } from "react-table";

export const seekerColumns: Column<any>[] = [
  { Header: "ID", accessor: "id", sortable: true, alwaysVisible: true },
  { Header: "Name", accessor: "name", sortable: true },
  { Header: "Email", accessor: "email", sortable: true },
  {
    Header: "Last Login",
    accessor: "last_login",
    Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "—"),
    sortable: true,
  },

  {
    Header: "Current Login",
    accessor: "current_login",
    Cell: ({ value }) => new Date(value).toLocaleDateString(),
    sortable: true,
  },
  { Header: "Age", accessor: "age", sortable: true },
  { Header: "Gender", accessor: "gender", sortable: true },
  { Header: "Location", accessor: "location", sortable: true },
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
