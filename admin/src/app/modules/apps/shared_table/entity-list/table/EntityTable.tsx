import { useTable, Column } from 'react-table'
import { useNavigate } from 'react-router-dom'
import { KTCardBody } from '../../../../../../_metronic/helpers'

import { Column as CustomColumn } from "../EntityList"

// type SortConfig<T> = {
//   key: keyof T
//   direction: 'asc' | 'desc'
// }

type Props<T extends { id?: number }> = {
  data: T[]
  columns: CustomColumn<T>[]
  enableRowClick?: boolean
  getRowLink?: (row: T) => string
  // sortConfig: SortConfig<T>
  // setSortConfig: React.Dispatch<React.SetStateAction<SortConfig<T>>>
  selectedRows?: Set<number>
  onRowSelect?: (id: number) => void
  onSelectAll?: (checked: boolean) => void
}

const EntityTable = <T extends { id?: number }>({
  data,
  columns,
  enableRowClick = false,
  getRowLink,
  // sortConfig,
  // setSortConfig,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
}: Props<T>) => {
  const navigate = useNavigate()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<T>({
    columns: columns as any,
    data,
  })

  // const handleSort = (col: CustomColumn<T>) => {
  //   if (col.sortable === false) return

  //   const key = col.id as keyof T

  //   setSortConfig((prev) => {
  //     if (prev.key === key) {
  //       return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
  //     }
  //     return { key, direction: 'asc' }
  //   })
  // }

  const allSelected = data.length > 0 && selectedRows.size === data.length
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length

  return (
    <KTCardBody>
      <div className='table-responsive'>
        <table
          className='table align-middle table-row-bordered table-row-gray-300 fs-6 g-9'
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((hg) => (
              <tr {...hg.getHeaderGroupProps()}>

                {onRowSelect && (
                  <th style={{ width: 40 }}>
                    <input
                      type='checkbox'
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected
                      }}
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                    />
                  </th>
                )}

                {hg.headers.map((col) => {
                  const column = col as unknown as CustomColumn<T>
                  return (
                    <th
                      {...col.getHeaderProps()}
                      // onClick={() => handleSort(column)}
                      style={{
                        cursor: column.sortable === false ? 'default' : 'pointer',
                        whiteSpace: 'nowrap',
                        fontWeight: 800,
                        fontSize: '16px',
                      }}
                    >
                      {col.render('Header')}

                      {/* {sortConfig.key === column.accessor && (
                        <span style={{ marginLeft: 6 }}>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )} */}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row) => {
                prepareRow(row)
                const rowData = row.original
                const rowId = rowData.id ?? -1
                const isSelected = selectedRows.has(rowId)

                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={() => {
                      if (enableRowClick && getRowLink) {
                        navigate(getRowLink(rowData), { state: rowData })
                      }
                    }}
                    style={{
                      whiteSpace: 'nowrap',
                      backgroundColor: isSelected ? 'rgba(var(--bs-primary-rgb), 0.05)' : undefined,
                    }}
                  >
                    {onRowSelect && (
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={() => onRowSelect(rowId)}
                        />
                      </td>
                    )}

                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onRowSelect ? 1 : 0)}
                  className='text-center'
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </KTCardBody>
  )
}

export { EntityTable }