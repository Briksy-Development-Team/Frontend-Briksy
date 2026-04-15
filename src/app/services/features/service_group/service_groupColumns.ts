import { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { ServiceGroup } from "./service_group.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const ServiceGroupColumns: Column<ServiceGroup>[] = [
  {
    Header: "ID",
    accessor: "id",
    alwaysVisible: true,
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Slug",
    accessor: "slug",
    Cell: ({ value }) => (value ? String(value) : "—"),
  },
  {
    Header: "Description",
    accessor: "description",
    Cell: ({ value }) => (value ? String(value) : "—"),
  },
  {
    Header: "Org Type",
    accessor: "organization_type",
    Cell: ({ value }) =>
      value && typeof value === "object" && "name" in value ? value.name : "—",
  },
  {
    Header: "Services",
    accessor: "services_count",
  },
  {
    Header: "Organizations",
    accessor: "organization_count",
  },
  {
    Header: "Created At",
    accessor: "created_at",
    Cell: ({ value }) => safeDate(value),
  },
  {
    Header: "Updated At",
    accessor: "updated_at",
    Cell: ({ value }) => safeDate(value),
  },
];
