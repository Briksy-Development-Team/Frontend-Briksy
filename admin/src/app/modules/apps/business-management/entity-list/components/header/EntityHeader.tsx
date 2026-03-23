import { useEffect } from 'react'
import { KTIcon } from '../../../../../../../_metronic/helpers'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { DynamicFilter } from './DynamicFilter'
import { ColumnSelector } from './ColumnSelector'

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

  columns: any[]
  visibleColumns: string[]
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>
}

const EntityHeader = ({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  columns,
  visibleColumns,
  setVisibleColumns,
}: Props) => {

  useEffect(() => {
    MenuComponent.createInstances('[data-kt-menu="true"]')
  }, [])

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

      <div className='card-toolbar d-flex align-items-center gap-4'>

        <DynamicFilter
          filters={filters}
          onFilterChange={onFilterChange}
        />

        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

      </div>
    </div>
  )
}

export { EntityHeader }