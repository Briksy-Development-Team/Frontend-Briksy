import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { UserListWrapper } from './user-list/UserList'
import UserDetail from './user-list/components/UserDetail'

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

        {/* LIST */}
        <Route
          path='user'
          element={
            <>
              <PageTitle breadcrumbs={UserBreadcrumbs}>User list</PageTitle>
              <UserListWrapper />
            </>
          }
        />

        {/* DETAIL */}
        <Route
          path='user/:id'
          element={
            <>
              <PageTitle breadcrumbs={UserBreadcrumbs}>User Detail</PageTitle>
              <UserDetail />
            </>
          }
        />

      </Route>

      <Route index element={<Navigate to="/apps/user-management/user" />} />
    </Routes>
  )
}

export default UserPage