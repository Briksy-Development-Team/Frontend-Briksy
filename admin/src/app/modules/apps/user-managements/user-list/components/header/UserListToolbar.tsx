import { UsersListFilter } from './UserListFilter'

type Props = {
  onFilterChange: (filters: any) => void
}

const UseristToolbar = ({ onFilterChange }: Props) => {
  return (
    <div className='d-flex justify-content-end'>
      <UsersListFilter onFilterChange={onFilterChange} />
    </div>
  )
}

export { UseristToolbar }