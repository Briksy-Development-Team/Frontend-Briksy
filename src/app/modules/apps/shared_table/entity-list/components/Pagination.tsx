import React from 'react'

const getPageSizeOptions = () => {
  return [5, 10, 25, 50, 100]
}

type Props = {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const Pagination = ({
  page,
  pageSize,
  total,
  onChange,
  onPageSizeChange,
}: Props) => {
  const totalPages = Math.ceil(total / pageSize)

  const getVisiblePages = () => {
    const pages: number[] = []

    const start = Math.max(1, page - 1)
    const end = Math.min(totalPages, page + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="d-flex justify-content-between align-items-center m-5">

      <div className="d-flex align-items-center gap-2">
        <span className="text-muted fs-5">Rows per page</span>

        <select
          className="form-select form-select-sm w-auto"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {getPageSizeOptions().map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex align-items-center gap-3">

        <div className="text-muted fs-5">
          {total === 0
            ? '0 of 0'
            : `${(page - 1) * pageSize + 1} – ${Math.min(
              page * pageSize,
              total
            )} of ${total}`}
        </div>

        <div className="d-flex align-items-center gap-1">

          <button
            className="btn btn-sm btn-icon"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
          >
            ‹
          </button>

          {visiblePages.map((p) => (
            <button
              key={p}
              className={`btn btn-sm btn-icon ${page === p ? ' btn-light' : 'btn-active-light-primary'
                }`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="btn btn-sm btn-icon "
            disabled={page === totalPages || totalPages === 0}
            onClick={() => onChange(page + 1)}
          >
            ›
          </button>

        </div>

      </div>
    </div>
  )
}

export default Pagination