import React from "react";
import { ColumnSelector } from "./ColumnSelector";
import SortSelector from "./SortSelector";
import { usePermissionAccess } from "../../../../../auth";
import { FilterDropdown, type FilterConfig, type FilterValue } from "./FilterDropdown";

type ColumnKey = string;

export type AddAction = {
  label: string;
  onClick: () => void;
  permission?: string;
};

export type BulkAction = {
  label: string;
  onClick: () => void;
  permission?: string;
  className?: string;
};

type Col = {
  accessor: ColumnKey;
  Header: string;
  alwaysVisible?: boolean;
  sortable?: boolean;
};

type Props = {
  columns: Col[];
  visibleColumns: ColumnKey[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<ColumnKey[]>>;
  search: string;
  onSearchChange: (val: string) => void;
  isMobile: boolean;
  onExport?: () => void;
  selectedCount?: number;
  onSortChange: (config: { key: ColumnKey; direction: "asc" | "desc" }) => void;
  headerActions?: AddAction[];
  bulkActions?: BulkAction[];
  filtersConfig?: FilterConfig[];
  onFilterChange?: (filters: Record<string, FilterValue>) => void;
  searchPlaceholder?: string;
  showActionsInToolbar?: boolean;
};

const EntityHeader = ({
  search,
  onSearchChange,
  columns,
  visibleColumns,
  setVisibleColumns,
  onExport,
  selectedCount = 0,
  onSortChange,
  headerActions,
  bulkActions,
  filtersConfig,
  onFilterChange,
  searchPlaceholder = "Search name, ID, ABN or email",
  showActionsInToolbar = false,
}: Props) => {
  const { hasPermission } = usePermissionAccess();
  const visibleHeaderActions =
    headerActions?.filter((action) => !action.permission || hasPermission(action.permission)) ?? [];
  const visibleBulkActions =
    bulkActions?.filter((action) => !action.permission || hasPermission(action.permission)) ?? [];

  return (
    <div className="briksy-toolbar">
      {/* Search Input Pill */}
      <div className="briksy-search-wrap">
        <span className="briksy-search-icon" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          className="briksy-search-input"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Dropdown */}
      {filtersConfig && onFilterChange && (
        <FilterDropdown filters={filtersConfig} onFilterChange={onFilterChange} />
      )}

      {/* Column Selector */}
      <ColumnSelector
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />

      <div className="briksy-toolbar-spacer" />

      {/* Sort Selector */}
      <SortSelector
        columns={columns.filter((c) => c.sortable)}
        onSortChange={onSortChange}
      />

      {/* Fallback Export / Add Buttons in Toolbar if not rendered in PageHeader */}
      {showActionsInToolbar && onExport && (
        <button
          onClick={onExport}
          type="button"
          className="briksy-btn-secondary"
          style={{ height: 38 }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
          {selectedCount > 0 && <span className="ms-1">({selectedCount})</span>}
        </button>
      )}

      {showActionsInToolbar &&
        visibleHeaderActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="briksy-btn-primary"
            style={{ height: 38 }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {action.label}
          </button>
        ))}

      {/* Bulk actions when rows are selected */}
      {selectedCount > 0 &&
        visibleBulkActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`btn btn-sm ${action.className ?? "btn-light-danger"} d-flex align-items-center gap-2`}
            style={{ borderRadius: 10, height: 38 }}
          >
            {action.label} ({selectedCount})
          </button>
        ))}
    </div>
  );
};

export { EntityHeader };
