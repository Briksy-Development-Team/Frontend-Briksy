import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { ServiceOffer } from "./service_offers.api";

export const serviceOffersConfig = {
  columns: [
    {
      Header: "Title",
      accessor: "title",
      sortable: true,
    },
    {
      Header: "Service",
      accessor: "service",
      Cell: ({ row }: { row: ServiceOffer }) =>
        row.service?.name ?? row.service_id ?? "—",
    },
    {
      Header: "Tag",
      accessor: "tag_label",
      Cell: ({ value }: { value: any }) => value ?? "BRIKSY EXCLUSIVE",
    },
    {
      Header: "Order",
      accessor: "sort_order",
      sortable: true,
    },
    {
      Header: "Status",
      accessor: "is_active",
      Cell: ({ value }: { value: any }) => (
        <span className={`badge badge-light-${value ? "success" : "danger"}`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ] satisfies Column<ServiceOffer>[],

  filters: [
    {
      key: "is_active",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
    },
  ],
};
