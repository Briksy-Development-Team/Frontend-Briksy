import { KTIcon } from '../../../../../../../_metronic/helpers'

type Props = {
  search: string
  onSearchChange: (value: string) => void
}

const UserListSearchComponent = ({ search, onSearchChange }: Props) => {
  return (
    <div className='card-title'>
      <div className='d-flex align-items-center position-relative my-1'>
        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />

        <input
          type='text'
          className='form-control form-control-solid w-250px ps-14'
          placeholder='Search user'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export { UserListSearchComponent }