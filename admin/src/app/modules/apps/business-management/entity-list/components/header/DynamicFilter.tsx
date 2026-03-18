import { useState } from 'react'

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
    <div className="d-flex gap-3">

      {filters.map((f) => (
        <select
          key={f.key}
          className="form-select w-150px"
          onChange={(e) => handleChange(f.key, e.target.value)}
        >
          <option value="">{f.label}</option>
          {f.options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ))}

      <button className="btn btn-light" onClick={reset}>
        Reset
      </button>

      <button className="btn btn-primary" onClick={apply}>
        Apply
      </button>
    </div>
  )
}

export { DynamicFilter }