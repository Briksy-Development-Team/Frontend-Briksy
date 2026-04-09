import { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Staff } from "./staff.types";

// const formatDate = (value?: string) => {
//   if (!value) return "—";
//   const date = new Date(value);
//   return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
// };

export const StaffColumns: Column<Staff>[] = [
  {
    Header: "ID",
    accessor: "id",
    alwaysVisible: true,
  },

  { Header: "Name", accessor: "name" },
  { Header: "Email", accessor: "email" },
  { Header: "Status", accessor: "status" },
  // {
  //   Header: "Updated At",
  //   accessor: "updated_at",
  //   sortable: true,
  //   Cell: ({ value }: any) => formatDate(value),
  // },
];
