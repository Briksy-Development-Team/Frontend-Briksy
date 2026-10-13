import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { Inquiry } from "./inquiry.types";
import { getDisplayId } from "../../utils/displayId";

export const inquiryConfig = {
  pricingColumns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: Inquiry; value: any }) => value || getDisplayId(row),
    },
    {
      Header: "Company",
      accessor: "company_name",
      sortable: false,
    },
    {
      Header: "Customer Name",
      accessor: "seeker_name",
      sortable: false,
    },
    {
      Header: "Customer Email",
      accessor: "seeker_email",
      sortable: false,
    },
    {
      Header: "Subject",
      accessor: "subject",
      sortable: true,
    },
    {
      Header: "Interested In",
      accessor: "interested_in",
      sortable: false,
      Cell: ({ value }: { value: string | string[] | null | undefined }) => (Array.isArray(value) ? value : value ? [value] : []).join(", ") || "—",
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
  ] satisfies Column<Inquiry>[],

  columns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: Inquiry; value: any }) => value || getDisplayId(row),
    },
    {
      Header: "Property",
      accessor: "property_title",
      sortable: false,
    },
    {
      Header: "Company",
      accessor: "organization_name",
      sortable: false,
    },
    {
      Header: "Customer Name",
      accessor: "seeker_name",
      sortable: false,
    },
    {
      Header: "Customer Email",
      accessor: "seeker_email",
      sortable: false,
    },
    {
      Header: "Subject",
      accessor: "subject",
      sortable: true,
    },
    {
      Header: "Interested In",
      accessor: "interested_in",
      sortable: false,
      Cell: ({ value }: { value: string | string[] | null | undefined }) => (Array.isArray(value) ? value : value ? [value] : []).join(", ") || "—",
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
  ] satisfies Column<Inquiry>[],

  serviceColumns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: Inquiry; value: any }) => value || getDisplayId(row),
    },
    {
      Header: "Company",
      accessor: "organization_name",
      sortable: false,
    },
    {
      Header: "Customer Name",
      accessor: "seeker_name",
      sortable: false,
    },
    {
      Header: "Customer Email",
      accessor: "seeker_email",
      sortable: false,
    },
    {
      Header: "Subject",
      accessor: "subject",
      sortable: true,
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
  ] satisfies Column<Inquiry>[],

  builderColumns: [
    {
      Header: "ID",
      accessor: "display_id",
      sortable: true,
      alwaysVisible: true,
      Cell: ({ row, value }: { row: Inquiry; value: any }) => value || getDisplayId(row),
    },
    { Header: "Company", accessor: "organization_name", sortable: false },
    { Header: "Customer Name", accessor: "seeker_name", sortable: false },
    { Header: "Customer Email", accessor: "seeker_email", sortable: false },
    { Header: "Subject", accessor: "subject", sortable: true },
    { Header: "Status", accessor: "status", sortable: true },
    { Header: "Created At", accessor: "created_at", sortable: true },
  ] satisfies Column<Inquiry>[],

  filters: [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["new", "contacted", "in_discussion", "checkout_sent", "payment_pending", "paid", "closed", "expired"],
    },
    {
      key: "lead_source",
      label: "Lead Source",
      type: "select",
      options: ["property_listing", "direct"],
    },
  ],
};
