import { useTable, Column } from 'react-table'
import { useNavigate } from 'react-router-dom'
import { KTCardBody } from '../../../../../../_metronic/helpers'

// ✅ Extend react-table column
type CustomColumn<T extends object> = Column<T> & {
  sortable?: boolean
}

// ✅ Proper sort config (NO null)
type SortConfig<T> = {
  key: keyof T
  direction: 'asc' | 'desc'
}

type Props<T extends { id?: number }> = {
  data: T[]
  columns: CustomColumn<T>[]
  enableRowClick?: boolean
  getRowLink?: (row: T) => string
  sortConfig: SortConfig<T>
  setSortConfig: React.Dispatch<React.SetStateAction<SortConfig<T>>>
}

const EntityTable = <T extends { id?: number }>({
  data,
  columns,
  enableRowClick = false,
  getRowLink,
  sortConfig,
  setSortConfig,
}: Props<T>) => {

  const navigate = useNavigate()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<T>({
    columns,
    data,
  })

  // ✅ Clean sort handler
  const handleSort = (col: CustomColumn<T>) => {
    if (col.sortable === false) return

    setSortConfig((prev) => {
      if (prev.key === col.accessor) {
        return {
          key: col.accessor as keyof T,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }
      }

      return {
        key: col.accessor as keyof T,
        direction: 'asc',
      }
    })
  }

  return (
    <KTCardBody>
      <div className="table-responsive">
        <table
          className="table align-middle table-row-bordered table-row-gray-300 fs-6 g-9"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((hg) => (
              <tr {...hg.getHeaderGroupProps()}>
                {hg.headers.map((col) => {
                  const column = col as CustomColumn<T>

                  return (
                    <th
                      {...col.getHeaderProps()}
                      onClick={() => handleSort(column)}
                      style={{
                        cursor:
                          column.sortable === false
                            ? 'default'
                            : 'pointer',
                        whiteSpace: 'nowrap',
                        fontWeight: 800,
                        fontSize: '16px',
                      }}
                    >
                      {col.render('Header')}

                      {sortConfig.key === column.accessor && (
                        <span style={{ marginLeft: 6 }}>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
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

                return (
                  <tr
                    {...row.getRowProps()} // ✅ removed duplicate key
                    onClick={() => {
                      if (enableRowClick && getRowLink) {
                        navigate(getRowLink(rowData), {
                          state: rowData,
                        })
                      }
                    }}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
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