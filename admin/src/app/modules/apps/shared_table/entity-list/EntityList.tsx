import { useEffect, useState } from "react";
import { EntityTable } from "./table/EntityTable";
import { EntityHeader } from "./components/header/EntityHeader";
import Paginations from "./components/Pagination";
import { exportToExcel } from "../utils/exportToExcel";
import ExportModal from "../utils/ExportModal";
import { PageHeader } from "./components/header/PageHeader";
import { SummaryFilters } from "./components/header/SummaryFilters";
import "./EntityList.css";

import type {
  RowAction,
  AddAction,
  BulkAction,
  BreadcrumbItem,
  SummaryCardItem,
  FilterConfig,
  Column,
  QueryParams,
} from "./types";

export type {
  RowAction,
  AddAction,
  BulkAction,
  BreadcrumbItem,
  SummaryCardItem,
  FilterConfig,
  Column,
  QueryParams,
};

type Props<T extends { id: number | string }> = {
  data: T[];
  total: number;
  params: QueryParams;
  onParamsChange: (params: QueryParams) => void;
  columns: Column<T>[];
  filtersConfig?: FilterConfig[];
  enableRowClick?: boolean;
  getRowLink?: (row: T) => string;
  storageKey?: string;
  headerActions?: AddAction[];
  bulkActions?: (selectedIds: T["id"][]) => BulkAction[];
  rowActions?: RowAction<T>[];
  onExportAll?: () => Promise<T[]>;

  // Optional props for unified page-level Figma rendering
  title?: string;
  subtitle?: string;
  breadcrumbs?: (string | BreadcrumbItem)[];
  summaryCards?: SummaryCardItem[];
  hideSummaryFilters?: boolean;
  hideHeader?: boolean;
  entityName?: string;
  searchPlaceholder?: string;
  profileType?: "duo" | "avatar" | "none" | "auto";
};

export function EntityList<T extends { id: number | string }>({
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
  bulkActions,
  rowActions,
  onExportAll,
  title,
  subtitle,
  breadcrumbs,
  summaryCards,
  hideSummaryFilters = false,
  hideHeader = false,
  entityName,
  searchPlaceholder,
  profileType = "auto",
}: Props<T>) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((c) => c.accessor as string),
  );
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  const selectedBulkActions = bulkActions ? bulkActions(Array.from(selectedRows)) : undefined;

  const showPageHeader = !hideHeader && Boolean(title);

  return (
    <div className="w-100" style={{ minWidth: 0 }}>
      {/* 1. Page Header (#4771:6646) if title is provided */}
      {showPageHeader && (
        <PageHeader
          title={title!}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          onExport={() => setIsExportOpen(true)}
          actions={headerActions}
        />
      )}

      {/* 2. Summary Filters (#4771:6661) above table */}
      {!hideSummaryFilters && (
        <SummaryFilters
          data={data}
          total={total}
          params={params}
          onFilterChange={(filters) =>
            onParamsChange({ ...params, filters, page: 1 })
          }
          filtersConfig={filtersConfig}
          customCards={summaryCards}
          entityName={entityName}
        />
      )}

      {/* 3. Table Card (#4771:6686) */}
      <div className="briksy-table-card">
        <EntityHeader
          search={params.search}
          onSearchChange={(val) =>
            onParamsChange({ ...params, search: val, page: 1 })
          }
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          isMobile={isMobile}
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
          bulkActions={selectedBulkActions}
          filtersConfig={filtersConfig}
          onFilterChange={(filters) =>
            onParamsChange({ ...params, filters, page: 1 })
          }
          searchPlaceholder={searchPlaceholder}
          showActionsInToolbar={!showPageHeader}
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
          profileType={profileType}
          entityName={entityName}
        />

        <Paginations
          page={params.page}
          per_page={params.per_page}
          total={total}
          onChange={(page) => onParamsChange({ ...params, page })}
          onPageSizeChange={(size) =>
            onParamsChange({ ...params, per_page: size, page: 1 })
          }
          entityName={entityName}
        />
      </div>

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
}

export default EntityList;
