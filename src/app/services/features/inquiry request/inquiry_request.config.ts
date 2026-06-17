import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { InquiryRequest } from "./inquiry_request.types";

export const InquiryRequestConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "id",
      sortable: true,
      alwaysVisible: true,
    },

    {
      Header: "Company",
      accessor: "company_name",
      sortable: true,
    },

    {
      Header: "Contact Name",
      accessor: "contact_name",
      sortable: true,
    },

    {
      Header: "Contact Email",
      accessor: "contact_email",
      sortable: true,
    },

    {
      Header: "Requested Plan",
      accessor: "requested_plan_name",
      sortable: true,
    },

    {
      Header: "Billing Cycle",
      accessor: "billing_cycle",
    },

    {
      Header: "Status",
      accessor: "status",
      sortable: true,
    },

    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
    },
  ] satisfies Column<InquiryRequest>[],

  filters: [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        "pending",
        "approved",
        "rejected",
        "cancelled",
      ],
    },

    {
      key: "billing_cycle",
      label: "Billing Cycle",
      type: "select",
      options: [
        "monthly",
        "yearly",
      ],
    },

    {
      key: "created_at",
      label: "Created Date",
      type: "dateRange",
    },
  ],

  addAction: {
    label: "New Plan Request",
  },

  rowActions: [
    {
      label: "Approve",
    },
    {
      label: "Reject",
    },
    {
      label: "Delete",
    },
  ],
};