import {KTIcon} from '../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {UsersListFilter} from './UsersListFilter'
import { useRoleAccess } from '../../../../../auth'

const UsersListToolbar = () => {
  const {setItemIdForUpdate} = useListView()
  const { canManageStaff } = useRoleAccess()
  const openAddUserModal = () => {
    if (!canManageStaff) {
      return
    }

    setItemIdForUpdate(null)
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <UsersListFilter />

      {/* begin::Export */}
      <button type='button' className='btn btn-light-primary me-3'>
        <KTIcon iconName='exit-up' className='fs-2' />
        Export
      </button>
      {/* end::Export */}

      {/* begin::Add staff member */}
      {canManageStaff && (
        <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
          <KTIcon iconName='plus' className='fs-2' />
          Add Staff Member
        </button>
      )}
      {/* end::Add staff member */}
    </div>
  )
}

export {UsersListToolbar}
