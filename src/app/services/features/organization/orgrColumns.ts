import { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Organization } from "./orgr.types";
import { formatDateTime } from "../../utils/dateFormat";

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
    Cell: ({ value }) => value ?? "—",
  },

  {
    Header: "Email",
    accessor: "contact_email",
    sortable: true,
    Cell: ({ value }) => value ?? "—",
  },

  {
    Header: "Phone",
    accessor: "contact_phone",
    Cell: ({ value }) => value ?? "—",
  },

  {
    Header: "ABN",
    accessor: "abn",
    Cell: ({ value }) => value ?? "—",
  },

  {
    Header: "ACN",
    accessor: "acn",
    Cell: ({ value }) => value ?? "—",
  },

  {
    Header: "Verified",
    accessor: "is_verified",
    Cell: ({ value }: { value: boolean }) =>
      value ? "✔ Verified" : "✖ Not Verified",
  },

  {
    Header: "Rating",
    accessor: "avg_org_rating",
    Cell: ({ value }) => value ?? "—",
  },

  {
    Header: "Created At",
    accessor: "created_at",
    sortable: true,
    Cell: ({ value }) => formatDateTime(value),
  },
];
