import { useEffect, useState } from 'react'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { KTIcon } from '../../../../../../../_metronic/helpers'

type Props = {
  onFilterChange: (filters: { status?: string }) => void
}

const UsersListFilter = ({ onFilterChange }: Props) => {
  const [status, setStatus] = useState('')

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const apply = () => {
    onFilterChange({ status })
  }

  const reset = () => {
    setStatus('')
    onFilterChange({})
  }

  return (
    <div>
      <button className='btn btn-light-primary' data-kt-menu-trigger='click'>
        <KTIcon iconName='filter' />
        Filter
      </button>

      <div className='menu menu-sub menu-sub-dropdown w-300px'>
        <div className='px-7 py-5'>
          <select
            className='form-select'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value=''>All</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
            <option value='blocked'>Blocked</option>
          </select>

          <div className='mt-4 d-flex justify-content-end'>
            <button className='btn btn-light me-2' onClick={reset}>
              Reset
            </button>
            <button className='btn btn-primary' onClick={apply}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { UsersListFilter }