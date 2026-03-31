type Column<T> = {
  Header: string;
  accessor: keyof T;
  sortable?: boolean;
  alwaysVisible?: boolean;
  Cell?: (value: any, row: T) => React.ReactNode;
};

type Seeker = {
  id: number;
  name: string;
  email: string;
  last_login?: string;
  current_login?: string;
  age?: number;
  gender?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
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
    Header: "Email",
    accessor: "email",
    sortable: true,
  },
  {
    Header: "Last Login",
    accessor: "last_login",
    sortable: true,
    Cell: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
  },
  {
    Header: "Current Login",
    accessor: "current_login",
    sortable: true,
    Cell: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
  },
  {
    Header: "Age",
    accessor: "age",
    sortable: true,
  },
  {
    Header: "Gender",
    accessor: "gender",
    sortable: true,
  },
  {
    Header: "Location",
    accessor: "location",
    sortable: true,
  },
  {
    Header: "Created At",
    accessor: "created_at",
    sortable: true,
    Cell: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
  },
  {
    Header: "Updated At",
    accessor: "updated_at",
    sortable: true,
    Cell: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
  },
];
