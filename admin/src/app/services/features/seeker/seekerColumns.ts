import { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";

type Seeker = {
  id: number;
  name: string;
  email: string;
  status: string;
  last_login?: string;
  current_login?: string;
  age?: number;
  gender?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

export const seekerColumns: Column<Seeker>[] = [
  { Header: "ID", accessor: "id", sortable: true, alwaysVisible: true },
  { Header: "Name", accessor: "name", sortable: true },
  { Header: "Email", accessor: "email", sortable: true },
  { Header: "Status", accessor: "status", sortable: true },

  {
    Header: "Last Login",
    accessor: "last_login",
    sortable: true,
    Cell: (value: any) => formatDate(value),
  },
  {
    Header: "Current Login",
    accessor: "current_login",
    sortable: true,
    Cell: (value) => formatDate(value as string),
  },
  { Header: "Age", accessor: "age", sortable: true },
  { Header: "Gender", accessor: "gender", sortable: true },
  { Header: "Location", accessor: "location", sortable: true },
  {
    Header: "Created At",
    accessor: "created_at",
    sortable: true,
    Cell: (value: any) => formatDate(value),
  },
  {
    Header: "Updated At",
    accessor: "updated_at",
    sortable: true,
    Cell: (value: any) => formatDate(value),
  },
];
