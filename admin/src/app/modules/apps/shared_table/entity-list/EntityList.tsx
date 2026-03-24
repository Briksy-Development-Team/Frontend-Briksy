import { useMemo, useState, useEffect } from "react"
import { KTCard } from "../../../../../_metronic/helpers"
import { EntityTable } from "./table/EntityTable"
import { EntityHeader } from "./components/header/EntityHeader"
import { SideFilter } from "./components/header/SideFilter"
import Paginations from "./components/Pagination"

const EntityList = ({
  data,
  columns,
  filtersConfig,
  enableRowClick,
  getRowLink,
  searchableKeys = [],
  storageKey = "visibleColumns",
}: any) => {

  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>({
    key: "id",
    direction: "asc",
  })

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : columns.map((c: any) => c.accessor)
    } catch {
      return columns.map((c: any) => c.accessor)
    }
  })

  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleColumns))
  }, [visibleColumns, storageKey])

  // RESET PAGE when data / filters / search / sort changes
  useEffect(() => {
    setPage(1)
  }, [data, search, filters, sortConfig])

  const filteredData = useMemo(() => {
    let result = [...data]

    // SEARCH + FILTER
    result = result.filter((item) => {
      const matchSearch =
        !search ||
        searchableKeys.some((key) =>
          String(item[key] || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )

      const matchFilters = Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true
        return values.includes(String(item[key]))
      })

      return matchSearch && matchFilters
    })

    // SORT
    if (sortConfig) {
      const getValue = (row: any, key: any) => {
        if (typeof key === "function") return key(row)
        return row[key]
      }

      result = [...result].sort((a, b) => {
        let valA = getValue(a, sortConfig.key)
        let valB = getValue(b, sortConfig.key)

        if (valA == null) return 1
        if (valB == null) return -1

        if (typeof valA === "string") valA = valA.toLowerCase()
        if (typeof valB === "string") valB = valB.toLowerCase()

        if (!isNaN(valA) && !isNaN(valB)) {
          return sortConfig.direction === "asc"
            ? Number(valA) - Number(valB)
            : Number(valB) - Number(valA)
        }

        return sortConfig.direction === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      })
    }

    return result
  }, [data, search, filters, sortConfig, searchableKeys])

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])

  const filteredColumns = useMemo(() => {
    return columns.filter(
      (col: any) => col.alwaysVisible || visibleColumns.includes(col.accessor)
    )
  }, [columns, visibleColumns])

  return (
    <>
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
    </>
  )
}

export { EntityList }