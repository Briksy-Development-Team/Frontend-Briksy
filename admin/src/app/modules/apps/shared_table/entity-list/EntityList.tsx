import { useMemo, useState, useEffect } from "react"
import { KTCard } from "../../../../../_metronic/helpers"
import { EntityTable } from "./table/EntityTable"
import { EntityHeader } from "./components/header/EntityHeader"
import { SideFilter } from "./components/header/SideFilter"
import Paginations from "./components/Pagination"

type Column<T> = {
  Header: string
  accessor: keyof T
  sortable?: boolean
  alwaysVisible?: boolean
}

type EntityListProps<T extends Record<string, any>> = {
  data: T[]
  columns: any[]
  filtersConfig?: any
  enableRowClick?: boolean
  getRowLink?: (row: T) => string
  searchableKeys?: (keyof T)[]
  storageKey?: string
}

type SortConfig<T> = {
  key: keyof T
  direction: "asc" | "desc"
}

const EntityList = <T extends Record<string, any>>({
  data,
  columns,
  filtersConfig,
  enableRowClick,
  getRowLink,
  searchableKeys = [],
  storageKey = "visibleColumns",
}: EntityListProps<T>) => {

  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: columns[0]?.accessor as keyof T,
    direction: "asc",
  })

  const [visibleColumns, setVisibleColumns] = useState<(keyof T)[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved
        ? JSON.parse(saved)
        : columns.map((c) => c.accessor)
    } catch {
      return columns.map((c) => c.accessor)
    }
  })

  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleColumns))
  }, [visibleColumns, storageKey])

  // ✅ Reset page only when needed
  useEffect(() => {
    setPage(1)
  }, [search, filters])

  // ✅ FILTER + SEARCH + SORT
  const filteredData = useMemo(() => {
    let result = [...data]

    // SEARCH + FILTER
    result = result.filter((item) => {
      const matchSearch =
        !search ||
        searchableKeys.some((key) => {
          const value = item[key]
          return String(value ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
        })

      const matchFilters = Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true
        return values.includes(String(item[key as keyof T]))
      })

      return matchSearch && matchFilters
    })

    // SORT
    result.sort((a, b) => {
      let valA = a[sortConfig.key]
      let valB = b[sortConfig.key]

      if (valA == null) return 1
      if (valB == null) return -1

      // number sort
      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc"
          ? valA - valB
          : valB - valA
      }

      // string sort
      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })

    return result
  }, [data, search, filters, sortConfig, searchableKeys])

  // ✅ PAGINATION
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])

  // ✅ COLUMN VISIBILITY
  const filteredColumns = useMemo(() => {
    return columns.filter(
      (col) =>
        col.alwaysVisible ||
        visibleColumns.includes(col.accessor)
    )
  }, [columns, visibleColumns])

  return (
    <div className="d-flex gap-5">
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <KTCard>

          <EntityHeader
            search={search}
            onSearchChange={setSearch}
            columns={columns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            isMobile={isMobile}
            onOpenFilter={() => setShowFilters(true)}
          />

          <EntityTable
            data={paginatedData}
            columns={filteredColumns}
            enableRowClick={enableRowClick}
            getRowLink={getRowLink}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />

          <Paginations
            page={page}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={setPage}
            onPageSizeChange={(size) => {
              setPage(1)
              setPageSize(size)
            }}
          />

        </KTCard>
      </div>

      {!isMobile && (
        <div style={{ width: 280 }}>
          <SideFilter
            filters={filtersConfig}
            onFilterChange={setFilters}
          />
        </div>
      )}
    </div>
  )
}

export { EntityList }