import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { formatDateTime } from "../../utils/dateFormat";
import type { BuyerBrief } from "./buyer_brief.types";

export const buyerBriefConfig = {
  columns: [
    { Header: "Client", accessor: "client_name", sortable: true },
    { Header: "Email", accessor: "client_email", sortable: false, Cell: ({ value }: { value: unknown }) => String(value ?? "—") },
    { Header: "Status", accessor: "status", sortable: true, Cell: ({ value }: { value: unknown }) => <span className="badge badge-light-primary text-capitalize">{String(value || "active").replace(/_/g, " ")}</span> },
    { Header: "Budget", accessor: "budget_min", sortable: true, Cell: ({ row }: { row: BuyerBrief }) => [row.budget_min, row.budget_max].some(Boolean) ? `$${Number(row.budget_min ?? 0).toLocaleString()} – $${Number(row.budget_max ?? 0).toLocaleString()}` : "—" },
    { Header: "Locations", accessor: "preferred_locations", sortable: false, Cell: ({ value }: { value: unknown }) => Array.isArray(value) ? value.join(", ") || "—" : "—" },
    { Header: "Created At", accessor: "created_at", sortable: true, Cell: ({ value }: { value: unknown }) => value ? formatDateTime(String(value)) : "—" },
  ] satisfies Column<BuyerBrief>[],
  filters: [{ key: "status", label: "Status", type: "select", options: ["active", "shortlisted", "matched", "closed"] }],
  storageKey: "buyerBriefColumns",
};
