import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Coupon } from "./coupon.types";

export const couponConfig = {
  columns: [
    {
      Header: "Code",
      accessor: "code",
      sortable: true,
    },
    {
      Header: "Name",
      accessor: "name",
      sortable: true,
    },
    {
      Header: "Discount Type",
      accessor: "discount_type",
    },
    {
      Header: "Discount",
      accessor: "discount_value",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Usage Count",
      accessor: "usage_count",
    },
    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
    },
  ] satisfies Column<Coupon>[],

  filters: [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Expired", value: "expired" },
      ],
    },
  ],
};
