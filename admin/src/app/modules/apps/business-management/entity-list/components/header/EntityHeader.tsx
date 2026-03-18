import { KTIcon } from '../../../../../../../_metronic/helpers'
import { DynamicFilter } from './DynamicFilter'

type FilterConfig = {
  key: string
  label: string
  options: string[]
}

type Props = {
  search: string
  onSearchChange: (value: string) => void
  filters: FilterConfig[]
  onFilterChange: (filters: any) => void
}

const EntityHeader = ({
  search,
  onSearchChange,
  filters,
  onFilterChange,
}: Props) => {
  return (
    <div className='card-header border-0 pt-6 d-flex justify-content-between'>

      <div className='card-title'>
        <div className='d-flex align-items-center position-relative my-1'>
          <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />

          <input
            type='text'
            className='form-control form-control-solid w-250px ps-14'
            placeholder='Search...'
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className='card-toolbar'>
        <DynamicFilter
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  )
}

export { EntityHeader }