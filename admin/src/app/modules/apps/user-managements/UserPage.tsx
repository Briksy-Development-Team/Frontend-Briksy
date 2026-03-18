import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { UserListWrapper } from './user-list/UserList'

const UserBreadcrumbs: Array<PageLink> = [
  {
    title: 'User Management',
    path: '/apps/user-management/user',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const UserPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='user'
          element={
            <>
              <PageTitle breadcrumbs={UserBreadcrumbs}>User list</PageTitle>
              <UserListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/apps/user-management/user" />} />
    </Routes>
  )
}

export default UserPage
