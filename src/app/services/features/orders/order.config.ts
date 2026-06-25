import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Order } from "./order.types";

export const orderConfig = {
  columns: [
    {
      Header: "Order Number",
      accessor: "order_number",
      sortable: true,
    },
    {
      Header: "Company",
      accessor: "organization",
      Cell: ({ value }: { value: any }) => value?.name ?? "—",
    },
    {
      Header: "Total",
      accessor: "total_amount",
      sortable: true,
    },
    {
      Header: "Currency",
      accessor: "currency",
    },
    {
      Header: "Payment Status",
      accessor: "payment_status",
      sortable: true,
    },
    {
      Header: "Order Status",
      accessor: "order_status",
      sortable: true,
    },
    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
    },
  ] satisfies Column<Order>[],

  filters: [
    {
      key: "payment_status",
      label: "Payment Status",
      type: "select",
      options: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "cancelled",
      ],
    },
    {
      key: "order_status",
      label: "Order Status",
      type: "select",
      options: [
        "draft",
        "confirmed",
        "active",
        "expired",
        "cancelled",
      ],
    },
  ],
};
