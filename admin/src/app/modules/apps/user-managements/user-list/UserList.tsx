import { useMemo, useState } from 'react'
import { UserListHeader } from './components/header/UserListHeader'
import { UserTable } from './table/UserTable'
import { KTCard } from '../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'

type User = {
  id: number
  name: string
  email: string
  status: string
  last_login: string
}

const UserfList = () => {
  // 🔥 MASTER DATA
  const [users] = useState<User[]>([
    { id: 1, name: 'Aryan Singh', email: 'aryan@brisky.com', status: 'Active', last_login: '2026-03-10' },
    { id: 2, name: 'Rahul Patel', email: 'rahul@brisky.com', status: 'Inactive', last_login: '2026-03-12' },
    { id: 3, name: 'Sneha Shah', email: 'sneha@brisky.com', status: 'Blocked', last_login: '2026-03-13' },
    { id: 4, name: 'Amit Kumar', email: 'amit@brisky.com', status: 'Active', last_login: '2026-03-14' },
    { id: 5, name: 'Neha Jain', email: 'neha@brisky.com', status: 'Inactive', last_login: '2026-03-15' },
    { id: 6, name: 'Aryan Singh', email: 'aryan@brisky.com', status: 'Active', last_login: '2026-03-10' },
    { id: 7, name: 'Rahul Patel', email: 'rahul@brisky.com', status: 'Inactive', last_login: '2026-03-12' },
    { id: 8, name: 'Sneha Shah', email: 'sneha@brisky.com', status: 'Blocked', last_login: '2026-03-13' },
    { id: 9, name: 'Amit Kumar', email: 'amit@brisky.com', status: 'Active', last_login: '2026-03-14' },
    { id: 10, name: 'Neha Jain', email: 'neha@brisky.com', status: 'Inactive', last_login: '2026-03-15' }, { id: 1, name: 'Aryan Singh', email: 'aryan@brisky.com', status: 'Active', last_login: '2026-03-10' },
    { id: 11, name: 'Rahul Patel', email: 'rahul@brisky.com', status: 'Inactive', last_login: '2026-03-12' },
    { id: 12, name: 'Sneha Shah', email: 'sneha@brisky.com', status: 'Blocked', last_login: '2026-03-13' },
    { id: 13, name: 'Amit Kumar', email: 'amit@brisky.com', status: 'Active', last_login: '2026-03-14' },
    { id: 14, name: 'Neha Jain', email: 'neha@brisky.com', status: 'Inactive', last_login: '2026-03-15' }, { id: 1, name: 'Aryan Singh', email: 'aryan@brisky.com', status: 'Active', last_login: '2026-03-10' },
    { id: 15, name: 'Rahul Patel', email: 'rahul@brisky.com', status: 'Inactive', last_login: '2026-03-12' },
    { id: 16, name: 'Sneha Shah', email: 'sneha@brisky.com', status: 'Blocked', last_login: '2026-03-13' },
    { id: 17, name: 'Amit Kumar', email: 'amit@brisky.com', status: 'Active', last_login: '2026-03-14' },
    { id: 18, name: 'Neha Jain', email: 'neha@brisky.com', status: 'Inactive', last_login: '2026-03-15' },
  ])

  // 🔥 STATE
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<{ status?: string }>({})

  // 🔥 FILTER + SEARCH
  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())

      const matchStatus =
        !filters.status ||
        user.status.toLowerCase() === filters.status.toLowerCase()

      return matchSearch && matchStatus
    })
  }, [users, search, filters])

  return (
    <KTCard>
      <UserListHeader
        search={search}
        onSearchChange={setSearch}
        onFilterChange={setFilters}
      />

      <UserTable data={filteredData} />
    </KTCard>
  )
}

const UserListWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <UserfList />
    </Content>
  </>
)

export { UserListWrapper }