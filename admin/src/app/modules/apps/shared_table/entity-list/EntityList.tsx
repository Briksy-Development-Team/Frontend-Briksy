import { useMemo, useState, useEffect } from "react"
import { Column as ReactTableColumn } from "react-table"
import { KTCard, KTIcon } from "../../../../../_metronic/helpers"
import { EntityTable } from "./table/EntityTable"
import { EntityHeader } from "./components/header/EntityHeader"
import { SideFilter } from "./components/header/SideFilter"
import Paginations from "./components/Pagination"
import { exportToExcel } from '../utils/exportToExcel'

export type EntityColumn<T extends object = object> = ReactTableColumn<T> & {
  sortable?: boolean
  alwaysVisible?: boolean
}

type Range = {
  min?: number
  max?: number
}

type DateRange = {
  from?: string
  to?: string
}

export type FilterValue = string[] | Range | DateRange

type EntityListProps<T extends object> = {
  data: T[]
  columns: EntityColumn<T>[]
  filtersConfig?: any
  enableRowClick?: boolean
  getRowLink?: (row: T) => string
  searchableKeys?: (keyof T)[]
  storageKey?: string
  onSearch?: (search: string) => void
  onFiltersChange?: (filters: Record<string, FilterValue>) => void
  onSortChange?: (sortConfig: SortConfig<T>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
}

type SortConfig<T> = {
  key: keyof T
  direction: "asc" | "desc"
}

const EntityList = <T extends Record<string, any>,>({
  data,
  columns,
  filtersConfig,
  enableRowClick,
  getRowLink,
  searchableKeys = [],
  storageKey = "visibleColumns",
  onSearch,
  onFiltersChange,
  onSortChange,
  onPaginationChange,
  pagination,
}: EntityListProps<T>) => {

  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, FilterValue>>({})
  const [internalPage, setInternalPage] = useState(1)
  const [internalPageSize, setInternalPageSize] = useState(10)
  const [showFilter, setShowFilter] = useState(false)

  const isServerSide = Boolean(pagination)
  const page = pagination?.page ?? internalPage
  const pageSize = pagination?.pageSize ?? internalPageSize
  const total = pagination?.total

  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: columns[0]?.accessor as keyof T,
    direction: "asc",
  })

  const [hasSortInitialized, setHasSortInitialized] = useState(false)

  useEffect(() => {
    if (!hasSortInitialized) {
      setHasSortInitialized(true)
      return
    }

    if (onSortChange) {
      onSortChange(sortConfig)
    }
  }, [sortConfig, onSortChange, hasSortInitialized])

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      const defaultVisible = columns
        .filter((c) => c.alwaysVisible)
        .map((c) =>
          typeof c.accessor === "string" ? c.accessor : String(c.id)
        )
      return saved ? JSON.parse(saved) : defaultVisible
    } catch {
      return columns.map((c) =>
        typeof c.accessor === "string" ? c.accessor : String(c.id)
      )
    }
  })

  const [isMobile, setIsMobile] = useState(false)

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

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
    if (!isServerSide) {
      setInternalPage(1)
    }
  }, [search, filters, isServerSide])

  useEffect(() => {
    if (onSearch) {
      onSearch(search)
    }
  }, [search, onSearch])

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }, [filters, onFiltersChange])

  useEffect(() => {
    if (!isServerSide && onPaginationChange) {
      onPaginationChange(internalPage, internalPageSize)
    }
  }, [internalPage, internalPageSize, onPaginationChange, isServerSide])

  useEffect(() => {
    setSelectedRows(new Set())
  }, [page, search, filters, data])

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(
      checked ? new Set(paginatedData.map((r: any) => r.id)) : new Set()
    )
  }

  const handleExport = () => {
    const rowsToExport =
      selectedRows.size > 0
        ? paginatedData.filter((r: any) => selectedRows.has(r.id))
        : paginatedData

    exportToExcel(rowsToExport, filteredColumns)
  }

  const filteredData = useMemo(() => {
    if (isServerSide) {
      return [...data]
    }

    let result = [...data]

    result = result.filter((item) => {
      const matchSearch =
        !search ||
        searchableKeys.some((key) => {
          const value = item[key]
          return String(value ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
        })

      const matchFilters = Object.entries(filters).every(([key, value]) => {
        const field = item[key as keyof T]

        if (!value) return true

        if (Array.isArray(value)) {
          if (!value.length) return true
          return value.includes(String(field))
        }

        if ('min' in value || 'max' in value) {
          const num = Number(field ?? 0)
          if (value.min !== undefined && num < value.min) return false
          if (value.max !== undefined && num > value.max) return false
          return true
        }

        if ('from' in value || 'to' in value) {
          if (!field) return false
          const itemDate = new Date(field as string).getTime()
          if (value.from) {
            const from = new Date(value.from).getTime()
            if (itemDate < from) return false
          }
          if (value.to) {
            const to = new Date(value.to).getTime()
            if (itemDate > to) return false
          }
          return true
        }

        return true
      })

      return matchSearch && matchFilters
    })

    result.sort((a, b) => {
      let valA = a[sortConfig.key]
      let valB = b[sortConfig.key]

      if (valA == null) return 1
      if (valB == null) return -1

      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA
      }

      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })

    return result
  }, [data, isServerSide, search, filters, sortConfig, searchableKeys])

  const paginatedData = useMemo(() => {
    if (isServerSide) {
      return filteredData
    }

    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, isServerSide, page, pageSize])

  const getColumnKey = (col: EntityColumn<T>) =>
    typeof col.accessor === "string" ? col.accessor : String(col.id)

  const headerColumns = useMemo(() => {
    return columns.map((col) => ({
      Header: typeof col.Header === "string" ? col.Header : String(col.Header),
      accessor: getColumnKey(col),
      alwaysVisible: col.alwaysVisible,
    }))
  }, [columns])

  const filteredColumns = useMemo(() => {
    return columns.filter(
      (col) => col.alwaysVisible || visibleColumns.includes(getColumnKey(col))
    )
  }, [columns, visibleColumns])

  return (
    <div className="d-flex gap-5">
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <KTCard>

          <EntityHeader
            search={search}
            onSearchChange={setSearch}
            columns={headerColumns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            isMobile={isMobile}
            onOpenFilter={() => setShowFilter(true)}
            onExport={handleExport}
            selectedCount={selectedRows.size}
          />

          <EntityTable
            data={paginatedData}
            columns={filteredColumns}
            enableRowClick={enableRowClick}
            getRowLink={getRowLink}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
          />

          <Paginations
            page={page}
            pageSize={pageSize}
            total={isServerSide ? total ?? filteredData.length : filteredData.length}
            onChange={(nextPage) => {
              if (isServerSide) {
                onPaginationChange?.(nextPage, pageSize)
              } else {
                setInternalPage(nextPage)
              }
            }}
            onPageSizeChange={(size) => {
              if (isServerSide) {
                onPaginationChange?.(1, size)
              } else {
                setInternalPage(1)
                setInternalPageSize(size)
              }
            }}
          />

        </KTCard>
      </div>

      {!isMobile && filtersConfig && (
        <div style={{ width: 280 }}>
          <SideFilter
            filters={filtersConfig}
            onFilterChange={setFilters}
          />
        </div>
      )}

      {isMobile && showFilter && filtersConfig && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setShowFilter(false)}
        >
          <div
            style={{
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              borderRadius: '16px 16px 0 0',
              background: 'var(--kt-card-bg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center px-5 pt-4 pb-2">
              <span className="fw-bold fs-5">Filters</span>
              <button
                className="btn btn-sm btn-icon btn-light"
                onClick={() => setShowFilter(false)}
              >
                <KTIcon iconName="cross" className="fs-2" />
              </button>
            </div>

            <SideFilter
              filters={filtersConfig}
              onFilterChange={(f) => {
                setFilters(f)
                setShowFilter(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export { EntityList }
