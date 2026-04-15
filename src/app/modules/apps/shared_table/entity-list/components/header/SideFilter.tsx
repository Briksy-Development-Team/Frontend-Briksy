import { useState } from 'react'
import { KTIcon } from '../../../../../../../_metronic/helpers'

type Range = {
  min?: number
  max?: number
}

type DateRange = {
  from?: string
  to?: string
}

type FilterValue = (string | number)[] | Range | DateRange

type FilterConfig =
  | {
    key: string
    label: string
    type: 'select'
    options: string[] | { label: string; value: string | number }[]
  }
  | { key: string; label: string; type: 'range' }
  | { key: string; label: string; type: 'dateRange' }

const SideFilter = ({
  filters,
  onFilterChange,
}: {
  filters: FilterConfig[]
  onFilterChange: (filters: Record<string, FilterValue>) => void
}) => {
  const [values, setValues] = useState<Record<string, FilterValue>>({})
  const [open, setOpen] = useState<string | null>(null)

  const toggleValue = (key: string, value: string | number) => {
    setValues((prev) => {
      const current = (prev[key] as (string | number)[]) || []
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

  const getCount = (key: string) => {
    const val = values[key]
    if (!val) return 0
    if (Array.isArray(val)) return val.length
    if ('min' in val || 'max' in val) return val.min || val.max ? 1 : 0
    if ('from' in val || 'to' in val) return val.from || val.to ? 1 : 0
    return 0
  }

  return (
    <div className="card shadow-sm px-4">
      <div className="card-header">
        <h5 className="card-title m-0">Filters</h5>
      </div>

      <div className="card-body p-0">
        {filters.map((f) => (
          <div key={f.key} className="border-bottom">
            <div
              className="d-flex justify-content-between px-5 py-4 cursor-pointer"
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
              <div className="pb-4">
                {f.type === 'select' && (
                  <div className="mh-200px overflow-auto">
                    {f.options.map((opt) => {
                      const optLabel = typeof opt === 'object' ? opt.label : opt
                      const optValue = typeof opt === 'object' ? opt.value : opt // ← no String()

                      return (
                        <label key={String(optValue)} className="form-check mb-2">
                          <input
                            type="checkbox"
                            checked={(
                              (values[f.key] as (string | number)[]) || []
                            ).includes(optValue)}
                            onChange={() => toggleValue(f.key, optValue)}
                          />
                          <span className="mx-3">{optLabel}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {f.type === 'range' && (
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="form-control"
                      value={(values[f.key] as Range)?.min ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValues((prev) => ({
                          ...prev,
                          [f.key]: {
                            ...(prev[f.key] as Range),
                            min: val === '' ? undefined : Number(val),
                          },
                        }))
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="form-control"
                      value={(values[f.key] as Range)?.max ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValues((prev) => ({
                          ...prev,
                          [f.key]: {
                            ...(prev[f.key] as Range),
                            max: val === '' ? undefined : Number(val),
                          },
                        }))
                      }}
                    />
                  </div>
                )}

                {f.type === 'dateRange' && (
                  <div className="gap-2">
                    <input
                      type="date"
                      className="form-control"
                      value={(values[f.key] as DateRange)?.from ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValues((prev) => ({
                          ...prev,
                          [f.key]: {
                            ...(prev[f.key] as DateRange),
                            from: val || undefined,
                          },
                        }))
                      }}
                    />
                    <input
                      type="date"
                      className="form-control"
                      value={(values[f.key] as DateRange)?.to ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValues((prev) => ({
                          ...prev,
                          [f.key]: {
                            ...(prev[f.key] as DateRange),
                            to: val || undefined,
                          },
                        }))
                      }}
                    />
                  </div>
                )}
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