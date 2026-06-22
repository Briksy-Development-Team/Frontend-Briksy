import { useEffect, useState } from "react";
import { KTCard } from "../../../../../_metronic/helpers";
import { EntityTable } from "./table/EntityTable";
import { EntityHeader } from "./components/header/EntityHeader";
import { SideFilter } from "./components/header/SideFilter";
import Paginations from "./components/Pagination";
import { exportToExcel } from "../utils/exportToExcel";
import type { ReactNode } from "react";
import type { RowAction } from "./table/EntityTable";
import type { AddAction } from "./components/header/EntityHeader";
import ExportModal from "../utils/ExportModal";

export type { RowAction, AddAction };

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
  filters?: Record<string, any>;
};

type Props<T extends { id: number | string }> = {
  data: T[];
  total: number;
  params: QueryParams;
  onParamsChange: (params: QueryParams) => void;
  columns: Column<T>[];
  filtersConfig?: any;
  enableRowClick?: boolean;
  getRowLink?: (row: T) => string;
  storageKey?: string;
  headerActions?: AddAction[];
  rowActions?: RowAction<T>[];
  onExportAll?: () => Promise<T[]>;
};

const EntityList = <T extends { id: number | string }>({
  data,
  total,
  params,
  onParamsChange,
  columns,
  filtersConfig,
  enableRowClick,
  getRowLink,
  storageKey = "visibleColumns",
  headerActions,
  rowActions,
  onExportAll,
}: Props<T>) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((c) => c.accessor as string),
  );
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<T["id"]>>(new Set());

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
  }, [visibleColumns, storageKey]);

  useEffect(() => {
    setSelectedRows(new Set());
  }, [data]);

  const toggleRow = (id: T["id"]) =>
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? new Set(data.map((r) => r.id)) : new Set());

  const exportAll = async (): Promise<void> => {
    if (!onExportAll) return;

    const allRows = await onExportAll();

    await exportToExcel(
      allRows as Record<string, unknown>[],
      columns
    );
  };
  const filteredColumns = columns.filter(
    (col) => col.alwaysVisible || visibleColumns.includes(col.accessor),
  );
  const exportSelected = async (): Promise<void> => {
    const rows = data.filter((r) => selectedRows.has(r.id));

    await exportToExcel(
      rows as Record<string, unknown>[],
      columns
    );
  };

  const exportCurrentPage = async (): Promise<void> => {
    await exportToExcel(
      data as Record<string, unknown>[],
      columns
    );
  };
  return (
    <div className="d-flex gap-5">
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <KTCard>
          <EntityHeader
            search={params.search}
            onSearchChange={(val) =>
              onParamsChange({ ...params, search: val, page: 1 })
            }
            columns={columns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            isMobile={isMobile}
            onOpenFilter={() => setShowFilter(true)}
            onExport={() => setIsExportOpen(true)}
            selectedCount={selectedRows.size}
            onSortChange={(config) =>
              onParamsChange({
                ...params,
                sort: config.key,
                direction: config.direction,
                page: 1,
              })
            }
            headerActions={headerActions}
          />

          <EntityTable
            data={data}
            columns={filteredColumns}
            enableRowClick={enableRowClick}
            getRowLink={getRowLink}
            selectedRows={selectedRows}
            onRowSelect={toggleRow}
            onSelectAll={toggleAll}
            rowActions={rowActions}
          />

          <Paginations
            page={params.page}
            per_page={params.per_page}
            total={total}
            onChange={(page) => onParamsChange({ ...params, page })}
            onPageSizeChange={(size) =>
              onParamsChange({ ...params, per_page: size, page: 1 })
            }
          />
        </KTCard>
      </div>

      {filtersConfig && !isMobile && (
        <div style={{ width: 280 }}>
          <SideFilter
            filters={filtersConfig}
            onFilterChange={(filters) =>
              onParamsChange({ ...params, filters, page: 1 })
            }
          />
        </div>
      )}

      {filtersConfig && isMobile && showFilter && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1050,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={() => setShowFilter(false)}
        >
          <div
            style={{
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "16px 16px 0 0",
              background: "var(--kt-card-bg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SideFilter
              filters={filtersConfig}
              onFilterChange={(f) => {
                onParamsChange({ ...params, filters: f, page: 1 });
                setShowFilter(false);
              }}
            />
          </div>
        </div>
      )}

      {isExportOpen && (
        <ExportModal
          selectedCount={selectedRows.size}
          onClose={() => setIsExportOpen(false)}
          onExportSelected={exportSelected}
          onExportCurrent={exportCurrentPage}
          onExportAll={exportAll}
        />
      )}
    </div>
  );
};

export { EntityList };
