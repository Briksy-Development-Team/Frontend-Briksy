import { KTIcon } from '../../../../../../../_metronic/helpers'
import { ColumnSelector } from './ColumnSelector'
import SortSelector from './SortSelector'

type ColumnKey = string

export type AddAction = { label: string; onClick: () => void }

type Col = { accessor: ColumnKey; Header: string; alwaysVisible?: boolean; sortable?: boolean }

type Props = {
  columns: Col[]
  visibleColumns: ColumnKey[]
  setVisibleColumns: React.Dispatch<React.SetStateAction<ColumnKey[]>>
  search: string
  onSearchChange: (val: string) => void
  isMobile: boolean
  onOpenFilter: () => void
  onExport?: () => void
  selectedCount?: number
  onSortChange: (config: { key: ColumnKey; direction: 'asc' | 'desc' }) => void
  addAction?: AddAction | null
}

const EntityHeader = ({
  search, onSearchChange, columns, visibleColumns, setVisibleColumns,
  isMobile, onOpenFilter, onExport, selectedCount = 0, onSortChange, addAction,
}: Props) => (
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
      <SortSelector
        columns={columns.filter((c) => c.sortable)}
        onSortChange={onSortChange}
      />

      {isMobile && (
        <button className='btn btn-light-primary' onClick={onOpenFilter}>Filter</button>
      )}

      <button
        onClick={onExport}
        disabled={!onExport}
        type='button'
        className={`btn d-flex align-items-center gap-2 ${selectedCount > 0 ? 'btn-primary' : 'btn-light-primary'}`}
      >
        <KTIcon iconName='exit-up' className='fs-2' />
        Export
        {selectedCount > 0 && <span className='ms-1'>{selectedCount}</span>}
      </button>

      <ColumnSelector
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />

      {addAction && (
        <button type='button' onClick={addAction.onClick} className='btn btn-primary d-flex align-items-center gap-2'>
          <KTIcon iconName='plus' className='fs-2' />
          {addAction.label}
        </button>
      )}
    </div>
  </div>
)

export { EntityHeader }