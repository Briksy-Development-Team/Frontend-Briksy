import { KTIcon } from '../../../../../../../_metronic/helpers'
import { ColumnSelector } from './ColumnSelector'
import SortSelector from './SortSelector'
// import { useListView } from '../../../../../../../core/ListViewProvider'
type ColumnKey = string

type Props = {
  columns: { accessor: ColumnKey; Header: string }[]
  visibleColumns: ColumnKey[]
  setVisibleColumns: React.Dispatch<React.SetStateAction<ColumnKey[]>>
  search: string
  onSearchChange: (val: string) => void
  isMobile: boolean
  onOpenFilter: () => void
  onExport?: () => void
  onAddUser?: () => void
  selectedCount?: number
  onSortChange: (config: {
    key: ColumnKey
    direction: 'asc' | 'desc'
  }) => void
}

const EntityHeader = ({
  search,
  onSearchChange,
  columns,
  visibleColumns,
  setVisibleColumns,
  isMobile,
  onOpenFilter,
  onExport,
  selectedCount = 0,
  onSortChange,
  onAddUser,
}: Props) => {
  const hasSelection = selectedCount > 0
  // const openAddUserModal = () => {
  //   setItemIdForUpdate(null)
  // }
  return (
    <div className='card-header border-0 pt-6 d-flex justify-content-between'>

      {/* SEARCH */}
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

        <SortSelector columns={columns} onSortChange={onSortChange} />

        {isMobile && (
          <button className='btn btn-light-primary' onClick={onOpenFilter}>
            Filter
          </button>
        )}

        <button
          onClick={onExport}
          disabled={!onExport}
          type='button'
          className={`btn d-flex align-items-center gap-2 ${hasSelection ? 'btn-primary' : 'btn-light-primary'
            }`}
        >
          <KTIcon iconName='exit-up' className='fs-2' />
          Export
          {hasSelection && <span>{selectedCount}</span>}
        </button>

        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
        <button
          type='button'
          onClick={onAddUser}
          className='btn d-flex align-items-center gap-2 btn-light-primary'
        >
          <KTIcon iconName='plus' className='fs-2' />
          Add User
        </button>
      </div>
    </div>
  )
}

export { EntityHeader }