import { useMemo, useState, useEffect } from 'react'
import { useTable } from 'react-table'
import { useNavigate } from 'react-router-dom'
import { KTCardBody } from '../../../../../../_metronic/helpers'

type Props<T extends { id?: number }> = {
  data: T[]
  columns: any[]
  pageSize?: number
  enableRowClick?: boolean
  getRowLink?: (row: T) => string
}

const EntityTable = <T extends { id?: number }>({
  data,
  columns,
  pageSize = 10,
  enableRowClick = false,
  getRowLink,
}: Props<T>) => {
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentPage(1)
  }, [data])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, currentPage, pageSize])

  const totalPages = Math.ceil(data.length / pageSize)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: paginatedData,
    })

  return (
    <KTCardBody>
      <div className='table-responsive'>
        <table
          className='table align-middle table-row-bordered table-row-gray-300 fs-6 gy-5'
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((hg) => (
              <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0' {...hg.getHeaderGroupProps()}>
                {hg.headers.map((col) => (
                  <th className='text-nowrap' {...col.getHeaderProps()}>
                    {col.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row) => {
                prepareRow(row)
                const rowData = row.original

                return (
                  <tr
                    {...row.getRowProps()}
                    style={{
                      cursor: enableRowClick ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (enableRowClick && getRowLink) {
                        navigate(getRowLink(rowData), {
                          state: rowData,
                        })
                      }
                    }}
                  >
                    {row.cells.map((cell) => (
                      <td className='text-nowrap' {...cell.getCellProps()}>
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
      {/* 👆 Closed table-responsive wrapper — pagination stays outside */}

      <div className='d-flex justify-content-between align-items-center mt-5'>
        <button
          className='btn btn-sm btn-light'
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <div>
          {Array.from({ length: totalPages || 1 }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-light'
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className='btn btn-sm btn-light'
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </KTCardBody>
  )
}

export { EntityTable }