import { useState } from 'react'
import { KTIcon } from '../../../../../../../_metronic/helpers'

type FilterConfig = {
  key: string
  label: string
  options: string[]
}

type Props = {
  filters: FilterConfig[]
  onFilterChange: (filters: Record<string, string[]>) => void
}

const SideFilter = ({ filters, onFilterChange }: Props) => {
  const [values, setValues] = useState<Record<string, string[]>>({})
  const [open, setOpen] = useState<string | null>(null)

  const toggleValue = (key: string, value: string) => {
    setValues((prev) => {
      const current = prev[key] || []

      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      }
    })
  }

  const toggleAccordion = (key: string) => {
    setOpen((prev) => (prev === key ? null : key))
  }

  const apply = () => onFilterChange(values)

  const reset = () => {
    setValues({})
    onFilterChange({})
  }

  const getCount = (key: string) => values[key]?.length || 0

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="card-title m-0">Filters</h5>
      </div>

      <div className="card-body p-0">
        {filters.map((f) => (
          <div key={f.key} className="border-bottom">
            <div
              className="d-flex justify-content-between align-items-center px-5 py-4 cursor-pointer"
              onClick={() => toggleAccordion(f.key)}
            >
              <div className="fw-bold">
                {f.label}
                {getCount(f.key) > 0 && (
                  <span className="badge badge-light-primary ms-2">
                    {getCount(f.key)}
                  </span>
                )}
              </div>

              <KTIcon
                iconName={open === f.key ? 'minus' : 'plus'}
                className="fs-2"
              />
            </div>

            {open === f.key && (
              <div className="px-5 pb-4">
                <div className="mh-200px overflow-auto">
                  {f.options.map((opt) => (
                    <label
                      key={opt}
                      className="form-check form-check-sm form-check-custom form-check-solid mb-2"
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={(values[f.key] || []).includes(opt)}
                        onChange={() => toggleValue(f.key, opt)}
                      />
                      <span className="form-check-label">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card-footer d-flex gap-2">
        <button className="btn btn-light w-100" onClick={reset}>
          Reset
        </button>
        <button className="btn btn-primary w-100" onClick={apply}>
          Apply
        </button>
      </div>
    </div>
  )
}

export { SideFilter }