const getPageSizeOptions = (total: number, step = 5) => {
  const options: number[] = []

  for (let i = step; i < total; i += step) {
    options.push(i)
  }

  options.push(total) 

  return options
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
  const options = getPageSizeOptions(total)

  return (
    <div className='d-flex justify-content-between align-items-center mt-5'>

      <button
        className='btn btn-sm btn-light'
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>

      <div>
        {Array.from({ length: totalPages || 1 }, (_, i) => (
          <button
            key={i}
            className={`btn btn-sm mx-1 ${page === i + 1 ? 'btn-primary' : 'btn-light'
              }`}
            onClick={() => onChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className='d-flex align-items-center gap-3'>

        <select
          className='form-select form-select-sm w-auto'
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {options.map((size) => (
            <option key={size} value={size}>
              {size === total ? `All (${total})` : size}
            </option>
          ))}
        </select>

        <button
          className='btn btn-sm btn-light'
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>

      </div>
    </div>
  )
}

export default Pagination