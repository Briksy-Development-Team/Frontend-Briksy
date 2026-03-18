import { UserListSearchComponent } from './UserListSearchComponent'
import { UseristToolbar } from './UserListToolbar'

type Props = {
  onSearchChange: (value: string) => void
  onFilterChange: (filters: any) => void
}

const UserListHeader = ({ onSearchChange, onFilterChange }: Props) => {
  return (
    <div className='card-header border-0 pt-6'>
      <UserListSearchComponent onSearchChange={onSearchChange} />

      <div className='card-toolbar'>
        <UseristToolbar onFilterChange={onFilterChange} />
      </div>
    </div>
  )
}

export { UserListHeader }