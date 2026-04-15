import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import Subscription from '../pages/Subscription/Subscription'
import ServiceGroup from '../pages/user management/ServiceGroup'


const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const StaffPage = lazy(() => import('../pages/user management/StaffPage'))
  const SeekerPage = lazy(() => import('../pages/user management/SeekerPgae'))
  // const AgencyPage = lazy(() => import('../pages/user management/ServicePage'))
  // const ServicePage = lazy(() => import('../pages/user management/ServicePage'))
  // const SoloPage = lazy(() => import('../pages/user management/user/SoloPage'))
  const UserPage = lazy(() => import('../pages/user management/UserPage'))





  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
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
            <SuspensedView>
              <SeekerPage />
            </SuspensedView>
          }
        />
        {/* <Route
          path='/apps/user/*'
          element={
            <SuspensedView>
              <OrganizationPage />
            </SuspensedView>
          }
        /> 
         <Route
          path='/apps/user/*'
          element={
            <SuspensedView>
              <SoloPage />
            </SuspensedView>
          }
        /> */}


        <Route
          path='/apps/user/*'
          element={
            <SuspensedView>
              <UserPage />
            </SuspensedView>
          }
        />

        <Route
          path='/apps/staff-management/staff/*'
          element={
            <SuspensedView>
              <StaffPage />
            </SuspensedView>
          }
        />
      

        {/* <Route
          path='/apps/business-management/*'
          element={
            <SuspensedView>
              <AgencyPage />
            </SuspensedView>
          }
        /> */}
        <Route
          path='/apps/subscription-plans'
          element={
            <SuspensedView>
              <Subscription />
            </SuspensedView>
          }
        />
        <Route
          path='/apps/property-management/*'
          element={
            <SuspensedView>
              {/* <Subscription /> */}
            </SuspensedView>
          }
        />
        <Route
          path='/apps/service-management/*'
          element={
            <SuspensedView>
              <ServiceGroup />
            </SuspensedView>
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
