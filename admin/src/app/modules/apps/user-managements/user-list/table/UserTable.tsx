import { useMemo, useState, useEffect } from 'react'
import { useTable, Column } from 'react-table'
import { KTCardBody } from '../../../../../../_metronic/helpers'

type User = {
  id: number
  name: string
  email: string
  status: string
  last_login: string
}

const UserTable = ({ data }: { data: User[] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    setCurrentPage(1)
  }, [data])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, currentPage])

  const totalPages = Math.ceil(data.length / pageSize)

  const columns: Column<User>[] = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Last Login', accessor: 'last_login' },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: paginatedData,
    })

  return (
    <KTCardBody>
      <table className='table' {...getTableProps()}>
        <thead>
          {headerGroups.map((hg) => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map((col) => (
                <th {...col.getHeaderProps()}>
                  {col.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.length > 0 ? (
            rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
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
              <td colSpan={4} className='text-center'>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-5">

        <button
          className="btn btn-sm btn-light"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <div>
          {Array.from({ length: totalPages || 1 }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-light"
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="btn btn-sm btn-light"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>

      </div>
    </KTCardBody>
  )
}

export { UserTable }