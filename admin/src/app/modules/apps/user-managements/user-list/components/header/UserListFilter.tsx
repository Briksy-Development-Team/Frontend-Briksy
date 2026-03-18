import { useEffect, useState } from 'react'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { KTIcon } from '../../../../../../../_metronic/helpers'

type Props = {
  onFilterChange: (filters: { status?: string }) => void
}

const UsersListFilter = ({ onFilterChange }: Props) => {
  const [status, setStatus] = useState<string>('')

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
    <>
      {/* Button */}
      <button
        type='button'
        className='btn btn-light-primary me-3'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        <KTIcon iconName='filter' className='fs-2' />
        Filter
      </button>

      {/* Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown w-300px w-md-325px'
        data-kt-menu='true'
      >
        <div className='px-7 py-5'>
          <div className='fs-5 fw-bolder'>Filter Options</div>
        </div>

        <div className='separator border-gray-200'></div>

        <div className='px-7 py-5'>
          <div className='mb-10'>
            <label className='form-label fw-bold'>Status:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value=''>All</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='blocked'>Blocked</option>
            </select>
          </div>

          <div className='d-flex justify-content-end'>
            <button
              type='button'
              onClick={reset}
              className='btn btn-light me-2'
              data-kt-menu-dismiss='true'
            >
              Reset
            </button>

            <button
              type='button'
              onClick={apply}
              className='btn btn-primary'
              data-kt-menu-dismiss='true'
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export { UsersListFilter }