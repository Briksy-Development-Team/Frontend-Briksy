import { useEffect, useState } from 'react'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { KTIcon } from '../../../../../../../_metronic/helpers'

type FilterConfig = {
  key: string
  label: string
  options: string[]
}

type Props = {
  filters: FilterConfig[]
  onFilterChange: (filters: any) => void
}

const DynamicFilter = ({ filters, onFilterChange }: Props) => {
  const [values, setValues] = useState<any>({})

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const handleChange = (key: string, value: string) => {
    setValues((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  const apply = () => {
    onFilterChange(values)
  }

  const reset = () => {
    setValues({})
    onFilterChange({})
  }

  return (
    <>
      {/* 🔥 Filter Button */}
      <button
        type="button"
        className="btn btn-light-primary me-3"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon iconName="filter" className="fs-2" />
        Filter
      </button>

      {/* 🔽 Dropdown Menu */}
      <div
        className="menu menu-sub menu-sub-dropdown w-300px w-md-325px"
        data-kt-menu="true"
      >
        {/* Header */}
        <div className="px-7 py-5">
          <div className="fs-5 fw-bolder">Filter Options</div>
        </div>

        <div className="separator border-gray-200"></div>

        {/* Filters */}
        <div className="px-7 py-5">

          {filters.map((f) => (
            <div className="mb-10" key={f.key}>
              <label className="form-label fw-bold">{f.label}:</label>

              <select
                className="form-select form-select-solid fw-bolder"
                value={values[f.key] || ''}
                onChange={(e) => handleChange(f.key, e.target.value)}
              >
                <option value="">All</option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Actions */}
          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={reset}
              className="btn btn-light me-2"
              data-kt-menu-dismiss="true"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={apply}
              className="btn btn-primary"
              data-kt-menu-dismiss="true"
            >
              Apply
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export { DynamicFilter }