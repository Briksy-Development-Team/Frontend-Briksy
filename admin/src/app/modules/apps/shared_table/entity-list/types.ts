import type { ReactNode } from "react";
import type { RowAction } from "./table/EntityTable";
import type { AddAction, BulkAction } from "./components/header/EntityHeader";
import type { BreadcrumbItem } from "./components/header/PageHeader";
import type { SummaryCardItem } from "./components/header/SummaryFilters";
import type { FilterConfig } from "./components/header/FilterDropdown";

export type { RowAction, AddAction, BulkAction, BreadcrumbItem, SummaryCardItem, FilterConfig };

export type Column<T> = {
  Header: string;
  accessor: Extract<keyof T, string> | `${Extract<keyof T, string>}.${string}`;
  sortable?: boolean;
  alwaysVisible?: boolean;
  Cell?: (props: { value: T[keyof T]; row: T }) => ReactNode;
};

export type QueryParams = {
  page: number;
  per_page: number;
  search: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, unknown>;
};
