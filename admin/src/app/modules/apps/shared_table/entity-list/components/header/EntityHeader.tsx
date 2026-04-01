import { KTIcon } from '../../../../../../../_metronic/helpers'
import { ColumnSelector } from './ColumnSelector'

type Props<T extends Record<string, any>> = {
  columns: { accessor: string; Header: string; alwaysVisible?: boolean }[]
  visibleColumns: string[]
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>
  search: string
  onSearchChange: (val: string) => void
  isMobile: boolean
  onOpenFilter: () => void
  onExport?: () => void
  selectedCount?: number
}

const EntityHeader = <T extends Record<string, any>>({
  search,
  onSearchChange,
  columns,
  visibleColumns,
  setVisibleColumns,
  isMobile,
  onOpenFilter,
  onExport,
  selectedCount = 0,


}: Props<T>) => {
  const hasSelection = selectedCount > 0

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

      <div className='card-toolbar d-flex gap-3'>

        {isMobile && (
          <button className='btn btn-light-primary' onClick={onOpenFilter}>
            Filter
          </button>
        )}

        <button
          onClick={onExport}
          disabled={!onExport}
          type='button'
          className={`btn me-3 d-flex align-items-center gap-2 ${hasSelection ? 'btn-primary' : 'btn-light-primary'
            }`}
        >
          <KTIcon iconName='exit-up' className='fs-2' />
          Export
          {hasSelection && (
            <span >
              {selectedCount}
            </span>
          )}
        </button>
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