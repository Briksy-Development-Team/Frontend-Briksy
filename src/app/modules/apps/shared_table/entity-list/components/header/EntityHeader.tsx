import { KTIcon } from "../../../../../../../_metronic/helpers";
import { ColumnSelector } from "./ColumnSelector";
import SortSelector from "./SortSelector";
import { FilterDropdown } from "./FilterDropdown";
import { usePermissionAccess } from "../../../../../auth";

type ColumnKey = string;

export type AddAction = {
  label: string;
  onClick: () => void;
  permission?: string;
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
  onOpenFilter: () => void;
  onExport?: () => void;
  selectedCount?: number;
  onSortChange: (config: { key: ColumnKey; direction: "asc" | "desc" }) => void;
  headerActions?: AddAction[];
  // Filter props
  filtersConfig?: any[];
  onFilterChange?: (filters: Record<string, any>) => void;
  activeFilterCount?: number;
};

const EntityHeader = ({
  search,
  onSearchChange,
  columns,
  visibleColumns,
  setVisibleColumns,
  isMobile,
  onOpenFilter,
  onExport,
  selectedCount = 0,
  onSortChange,
  headerActions,
  filtersConfig,
  onFilterChange,
  activeFilterCount = 0,
}: Props) => {
  const { hasPermission } = usePermissionAccess();
  const visibleHeaderActions =
    headerActions?.filter((action) => !action.permission || hasPermission(action.permission)) ?? [];

  return (
    <div className="card-header border-0 pt-6 d-flex justify-content-between">
      <div className="card-title">
        <div className="d-flex align-items-center position-relative my-1">
          <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
          <input
            type="text"
            className="form-control form-control-solid w-250px ps-14"
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="card-toolbar d-flex gap-3">
        <SortSelector
          columns={columns.filter((c) => c.sortable)}
          onSortChange={onSortChange}
        />

        {/* ── Filter: desktop = dropdown, mobile = bottom-sheet trigger ── */}
        {filtersConfig && filtersConfig.length > 0 && (
          isMobile ? (
            <button className="btn btn-light-primary" onClick={onOpenFilter}>
              <KTIcon iconName="filter" className="fs-3" />
              Filter
            </button>
          ) : (
            <FilterDropdown
              filters={filtersConfig}
              onFilterChange={onFilterChange ?? (() => {})}
              activeCount={activeFilterCount}
            />
          )
        )}

        <button
          onClick={onExport}
          disabled={!onExport}
          type="button"
          className={`btn d-flex align-items-center gap-2 ${selectedCount > 0 ? "btn-primary" : "btn-light-primary"}`}
        >
          <KTIcon iconName="exit-up" className="fs-2" />
          Export
          {selectedCount > 0 && <span className="ms-1">{selectedCount}</span>}
        </button>

        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        {visibleHeaderActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              action.onClick();
            }}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <KTIcon iconName="plus" className="fs-2" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export { EntityHeader };
