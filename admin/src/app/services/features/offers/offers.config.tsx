import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { PropertyOffer } from "../properties/property.types";

export const offersConfig = {
  columns: [
    {
      Header: "Title",
      accessor: "title",
      sortable: true,
    },
    {
      Header: "Property",
      accessor: "property_listing",
      Cell: ({ row }: { row: PropertyOffer }) =>
        row.property_listing?.title ?? row.property_listing_id ?? "—",
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
  ] satisfies Column<PropertyOffer>[],

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
