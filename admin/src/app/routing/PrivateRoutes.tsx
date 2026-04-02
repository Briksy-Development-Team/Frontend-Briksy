import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import Subscription from '../pages/Subscription/Subscription'
import { RoleBasedRedirect } from './RoleBasedRedirect'
import { AuthorizedRoute } from './AuthorizedRoute'
import {
  canAccessDashboard,
  canManageBusinesses,
  canManageProperties,
  canManageSeekers,
  canManageServices,
  canManageStaff,
  canManageSubscriptions,
} from '../modules/auth/core/roleRoutes'


const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const StaffPage = lazy(() => import('../modules/apps/staff-management/StaffPage'))
  const SeekerPage = lazy(() => import('../pages/user/SeekerPgae'))
  const AgencyPage = lazy(() => import('../pages/user/ServicePage'))



  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<RoleBasedRedirect />} />
        <Route index element={<RoleBasedRedirect />} />
        {/* Pages */}
        <Route path='dashboard' element={<RoleBasedRedirect requireDashboardAccess />} />
        <Route
          path='dashboard/home'
          element={<AuthorizedRoute canAccess={canAccessDashboard} element={<DashboardWrapper />} />}
        />
        {/* <Route path='builder' element={<BuilderPageWrapper />} /> */}
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />

        <Route
          path='/apps/seeker-management/*'
          element={
            <AuthorizedRoute
              canAccess={canManageSeekers}
              element={
                <SuspensedView>
                  <SeekerPage />
                </SuspensedView>
              }
            />
          }
        />

        <Route
          path='/apps/staff-management/*'
          element={
            <AuthorizedRoute
              canAccess={canManageStaff}
              element={
                <SuspensedView>
                  <StaffPage />
                </SuspensedView>
              }
            />
          }
        />

        <Route
          path='/apps/business-management/*'
          element={
            <AuthorizedRoute
              canAccess={canManageBusinesses}
              element={
                <SuspensedView>
                  <AgencyPage />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path='/apps/subscription-plans'
          element={
            <AuthorizedRoute
              canAccess={canManageSubscriptions}
              element={
                <SuspensedView>
                  <Subscription />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path='/apps/property-management/*'
          element={
            <AuthorizedRoute
              canAccess={canManageProperties}
              element={
                <SuspensedView>
                  {/* <Subscription /> */}
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path='/apps/service-management/*'
          element={
            <AuthorizedRoute
              canAccess={canManageServices}
              element={
                <SuspensedView>
                  {/* <Subscription /> */}
                </SuspensedView>
              }
            />
          }
        />

        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
