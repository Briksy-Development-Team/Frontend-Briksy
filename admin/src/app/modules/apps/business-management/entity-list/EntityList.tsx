import { useMemo, useState, useEffect } from 'react'
import { KTCard } from '../../../../../_metronic/helpers'
import { EntityTable } from './table/EntityTable'
import { EntityHeader } from './components/header/EntityHeader'

type FilterConfig = {
  key: string
  label: string
  options: string[]
}

type Props = {
  data: any[]
  columns: any[]
  filtersConfig: FilterConfig[]
  enableRowClick?: boolean
  getRowLink?: (row: any) => string
  searchableKeys?: string[]
}

const EntityList = ({
  data,
  columns,
  filtersConfig,
  enableRowClick,
  getRowLink,
  searchableKeys = [],
}: Props) => {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<any>({})

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.accessor)
  )

  useEffect(() => {
    const saved = localStorage.getItem('visibleColumns')
    if (saved) setVisibleColumns(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns))
  }, [visibleColumns])

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        !search ||
        searchableKeys.some((key) =>
          String(item[key] || '')
            .toLowerCase()
            .includes(search.toLowerCase())
        )

      const matchFilters = Object.entries(filters).every(
        ([key, value]) =>
          !value ||
          String(item[key] || '').toLowerCase() === value.toLowerCase()
      )

      return matchSearch && matchFilters
    })
  }, [data, search, filters, searchableKeys])

  // ✅ Filter columns
  const filteredColumns = useMemo(() => {
    return columns.filter((col) =>
      visibleColumns.includes(col.accessor)
    )
  }, [columns, visibleColumns])

  return (
    <KTCard>
      <EntityHeader
        search={search}
        onSearchChange={setSearch}
        filters={filtersConfig}
        onFilterChange={setFilters}

        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />

      <EntityTable
        data={filteredData}
        columns={filteredColumns}
        enableRowClick={enableRowClick}
        getRowLink={getRowLink}
      />
    </KTCard>
  )
}

export { EntityList }