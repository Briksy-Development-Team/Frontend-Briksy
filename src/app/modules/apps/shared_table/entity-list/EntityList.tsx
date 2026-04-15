import { useEffect, useState } from "react"
import { KTCard } from "../../../../../_metronic/helpers"
import { EntityTable } from "./table/EntityTable"
import { EntityHeader } from "./components/header/EntityHeader"
import { SideFilter } from "./components/header/SideFilter"
import Paginations from "./components/Pagination"
import { exportToExcel } from "../utils/exportToExcel"
import { ReactNode } from "react"

export type Column<T> = {
  Header: string
  accessor: Extract<keyof T, string>
  sortable?: boolean
  alwaysVisible?: boolean
  Cell?: (props: { value: T[keyof T]; row: T }) => ReactNode
}

export type QueryParams = {
  page: number
  per_page: number
  search: string
  sort?: string
  direction?: "asc" | "desc"
  filters?: Record<string, any>
}

type EntityListProps<T extends { id: number | string }> = {
  data: T[]
  total: number
  params: QueryParams
  onParamsChange: (params: QueryParams) => void
  columns: Column<T>[]
  filtersConfig?: any
  enableRowClick?: boolean
  getRowLink?: (row: T) => string
  storageKey?: string

  onEdit?: (row: T) => void
}

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
  onEdit,
}: EntityListProps<T>) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return columns.map((c) => c.accessor as string)

      const parsed = JSON.parse(saved)
      return parsed.filter((key: string) =>
        columns.some((col) => col.accessor === key)
      )
    } catch {
      return columns.map((c) => c.accessor as string)
    }
  })

  const [isMobile, setIsMobile] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<T["id"]>>(new Set())

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleColumns))
  }, [visibleColumns, storageKey])

  useEffect(() => {
    setSelectedRows(new Set())
  }, [data])

  const handleRowSelect = (id: T["id"]) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(
      checked ? new Set(data.map((r) => r.id)) : new Set()
    )
  }

  const handleExport = () => {
    const rowsToExport =
      selectedRows.size > 0
        ? data.filter((r) => selectedRows.has(r.id))
        : data

    exportToExcel(rowsToExport, columns)
  }

  const filteredColumns = columns.filter(
    (col) => col.alwaysVisible || visibleColumns.includes(col.accessor)
  )

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
            onAddUser={() => onEdit?.(null as any)}
            isMobile={isMobile}
            onOpenFilter={() => setShowFilter(true)}
            onExport={handleExport}
            selectedCount={selectedRows.size}
            onSortChange={(config) =>
              onParamsChange({
                ...params,
                sort: config.key,
                direction: config.direction,
                page: 1,
              })
            }
          />

          <EntityTable
            data={data}
            columns={filteredColumns}
            enableRowClick={enableRowClick}
            getRowLink={getRowLink}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            onEdit={(row) => onEdit?.(row)}
          />

          <Paginations
            page={params.page}
            per_page={params.per_page}
            total={total}
            onChange={(page) =>
              onParamsChange({ ...params, page })
            }
            onPageSizeChange={(size) =>
              onParamsChange({ ...params, per_page: size, page: 1 })
            }
          />
        </KTCard>
      </div>

      {filtersConfig && (
        <>
          {!isMobile && (
            <div style={{ width: 280 }}>
              <SideFilter
                filters={filtersConfig}
                onFilterChange={(filters) =>
                  onParamsChange({ ...params, filters, page: 1 })
                }
              />
            </div>
          )}

          {isMobile && showFilter && (
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
                    onParamsChange({ ...params, filters: f, page: 1 })
                    setShowFilter(false)
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { EntityList }