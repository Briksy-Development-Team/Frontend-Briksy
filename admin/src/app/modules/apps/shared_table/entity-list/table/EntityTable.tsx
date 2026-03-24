import { useTable } from 'react-table'
import { useNavigate } from 'react-router-dom'
import { KTCardBody } from '../../../../../../_metronic/helpers'

type SortConfig = {
  key: any
  direction: 'asc' | 'desc'
} | null

type Props<T extends { id?: number }> = {
  data: T[]
  columns: any[]
  enableRowClick?: boolean
  getRowLink?: (row: T) => string
  sortConfig: SortConfig
  setSortConfig: React.Dispatch<any>
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    })

  const handleSort = (col: any, sortable: boolean) => {
    if (!sortable) return

    setSortConfig((prev: SortConfig) => {
      if (prev?.key === col.accessor) {
        if (prev.direction === 'asc') {
          return { key: col.accessor, direction: 'desc' }
        }
        return null
      }
      return { key: col.accessor, direction: 'asc' }
    })
  }

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
                {hg.headers.map((col: any) => (
                  <th
                    key={col.id}
                    {...col.getHeaderProps()}
                    onClick={() =>
                      handleSort(col, col.sortable !== false)
                    }
                    style={{
                      cursor:
                        col.sortable === false ? 'default' : 'pointer',
                      whiteSpace: "nowrap",
                      fontWeight: 800,
                      fontSize: "16px"
                    }}
                  >
                    {col.render('Header')}

                    {sortConfig?.key === col.accessor && (
                      <span style={{ marginLeft: 6 }}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
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
                    key={row.id}
                    {...row.getRowProps()}
                    onClick={() => {
                      if (enableRowClick && getRowLink) {
                        navigate(getRowLink(rowData), {
                          state: rowData,
                        })
                      }
                    }}
                    style={{
                      whiteSpace: "nowrap"
                    }}
                  >
                    {row.cells.map((cell) => (
                      <td key={cell.column.id} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center'>
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