import { useEffect, useState } from "react"
import { KTCard, KTIcon } from "../../../../../_metronic/helpers"
import { EntityTable } from "./table/EntityTable"
import { EntityHeader } from "./components/header/EntityHeader"
import { SideFilter } from "./components/header/SideFilter"
import Paginations from "./components/Pagination"
import { exportToExcel } from "../utils/exportToExcel"
import { ReactNode } from "react"
import UserEditModal from "./components/header/UserEditModal"

export type Column<T> = {
  Header: string
  accessor: keyof T
  sortable?: boolean
  alwaysVisible?: boolean
  Cell?: (value: T[keyof T], row: T) => ReactNode
}

type EntityListProps<T extends { id?: number }> = {
  data: T[]
  total: number
  params: any
  onParamsChange: (params: any) => void
  onSave?: (updated: T, isNew: boolean) => void
  columns: Column<T>[]
  filtersConfig?: any
  enableRowClick?: boolean
  getRowLink?: (row: T) => string
  storageKey?: string
}

const EntityList = <T extends { id?: number }>({
  data,
  total,
  params,
  onParamsChange,
  onSave,
  columns,
  filtersConfig,
  enableRowClick,
  getRowLink,
  storageKey = "visibleColumns",
}: EntityListProps<T>) => {
  const [visibleColumns, setVisibleColumns] = useState<(keyof T)[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : columns.map((c) => c.accessor)
    } catch {
      return columns.map((c) => c.accessor)
    }
  })

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<T | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
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
    setSelectedRows(new Set())
  }, [data])

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? new Set(data.map((r) => r.id!)) : new Set())
  }

  const handleExport = () => {
    const rowsToExport = selectedRows.size > 0
      ? data.filter((r) => selectedRows.has(r.id!))
      : data
    exportToExcel(rowsToExport, columns)
  }

  const closeModal = () => {
    setEditingUser(null)
    setShowModal(false)
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
            onSearchChange={(val) => onParamsChange({ ...params, search: val, page: 1 })}
            columns={columns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            onAddUser={() => setShowModal(true)}
            isMobile={isMobile}
            onOpenFilter={() => setShowFilter(true)}
            onExport={handleExport}
            selectedCount={selectedRows.size}
            onSortChange={(config) =>
              onParamsChange({ ...params, sortBy: config.key, sortOrder: config.direction })
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
            onEdit={(user) => {
              setEditingUser(user)
              setShowModal(true)
            }}
          />

          <Paginations
            page={params.page}
            per_page={params.per_page}
            total={total}
            onChange={(page) => onParamsChange({ ...params, page })}
            onPageSizeChange={(size) => onParamsChange({ ...params, per_page: size, page: 1 })} />
        </KTCard>
      </div>

      {showModal && (
        <UserEditModal
          user={editingUser}
          onSave={(updatedUser: T) => {
            onSave?.(updatedUser, !editingUser)
            closeModal()
          }}
          onClose={closeModal}
        />
      )}

      {filtersConfig && (
        <>
          {!isMobile && (
            <div style={{ width: 280 }}>
              <SideFilter
                filters={filtersConfig}
                onFilterChange={(filters) => onParamsChange({ ...params, filters, page: 1 })}
              />
            </div>
          )}

          {isMobile && showFilter && (
            <div
              style={{ position: "fixed", inset: 0, zIndex: 1050, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end" }}
              onClick={() => setShowFilter(false)}
            >
              <div
                style={{ width: "100%", maxHeight: "80vh", overflowY: "auto", borderRadius: "16px 16px 0 0", background: "var(--kt-card-bg)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="d-flex justify-content-between align-items-center px-5 pt-4 pb-2">
                  <span className="fw-bold fs-5">Filters</span>
                  <button className="btn btn-sm btn-icon btn-light" onClick={() => setShowFilter(false)}>
                    <KTIcon iconName="cross" className="fs-2" />
                  </button>
                </div>
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