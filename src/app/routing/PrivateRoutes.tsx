import { FC, Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import TopBarProgress from 'react-topbar-progress-indicator'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import { PermissionGuard, RoleGuard, useAuth } from '../modules/auth'
import { getRoleHomeRoute } from '../modules/auth/core/roleRoutes'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { ComingSoonPage } from '../pages/ComingSoonPage'
import PlanRequestPage from '../pages/platform/PlanRequestPage'
import CouponPage from '../pages/platform/CouponPage'
import OrderPage from '../pages/platform/OrderPage'
import SettingsPage from '../pages/platform/SettingsPage'
import PermissionsPage from '../pages/platform/PermissionsPage'

const PrivateRoutes = () => {
  const { currentUser } = useAuth()
  const homeRoute = getRoleHomeRoute(currentUser?.roles ?? [])
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const StaffPage = lazy(() => import('../pages/user management/StaffPage'))
  const SeekerPage = lazy(() => import('../pages/user management/SeekerPgae'))
  const SoloPage = lazy(() => import('../pages/user management/user/SoloPage'))
  const UserPage = lazy(() => import('../pages/user management/UserPage'))
  const Subscription = lazy(() => import('../pages/Subscription/Subscription'))
  const EmailTemplatePage = lazy(() => import('../pages/email/EmailTemplatePage'))
  const PropertyListPage = lazy(() => import('../pages/user management/PropertyList'))
  const ServiceListPage = lazy(() => import('../pages/user management/ServiceList'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="auth/*" element={<Navigate to={homeRoute} replace />} />
        <Route path="/dashboard" element={<Navigate to={homeRoute} replace />} />
        <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        <Route
          path="/super-admin/dashboard"
          element={
            <RoleGuard allow={['super_admin']}>
              <DashboardWrapper />
            </RoleGuard>
          }
        />

        <Route path="/super-admin/users/*" element={<Navigate to="/super-admin/seekers" replace />} />

        <Route
          path="/admin/dashboard"
          element={
            <RoleGuard allow={['admin', 'admin_staff']}>
              <DashboardWrapper />
            </RoleGuard>
          }
        />
        <Route path="menu-test" element={<MenuTestPage />} />

        <Route
          path="crafted/pages/profile/*"
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />

        <Route
          path="/super-admin/seekers/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <SeekerPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/companies/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <UserPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/companies/solo-traders/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <SoloPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/admin/users/*"
          element={
            <RoleGuard allow={['admin', 'admin_staff']}>
              <SuspensedView>
                <StaffPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/admin/orders/*"
          element={
            <RoleGuard allow={['admin', 'admin_staff']}>
              <SuspensedView>
                <OrderPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/admin/plan-requests/*"
          element={
            <RoleGuard allow={['admin', 'admin_staff']}>
              <SuspensedView>
                <PlanRequestPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/admin/coupons/*"
          element={
            <RoleGuard allow={['admin', 'admin_staff']}>
              <SuspensedView>
                <CouponPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/staff/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <StaffPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/plans/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <Subscription />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/orders/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <OrderPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/referral-programs/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <ComingSoonPage
                  title="Referral Programs"
                  description="Referral program management is being finalized. This page will let super admins manage rewards, commissions, and tracking."
                />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/coupons/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <CouponPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/plan-requests/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <PlanRequestPage />
              </SuspensedView>
            </RoleGuard>
          }
        />
        <Route
          path="/super-admin/email-templates/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <EmailTemplatePage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/permissions/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <PermissionGuard anyOf={['permission.view', 'permission.manage']}>
                <SuspensedView>
                  <PermissionsPage />
                </SuspensedView>
              </PermissionGuard>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/property-management/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <PropertyListPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/services/*"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <ServiceListPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/admin/property-management/*"
          element={
            <RoleGuard allow={['admin', 'admin_staff']}>
              <SuspensedView>
                <PropertyListPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/super-admin/settings"
          element={
            <RoleGuard allow={['super_admin']}>
              <SuspensedView>
                <SettingsPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <RoleGuard allow={['admin', 'admin_staff']}>
              <SuspensedView>
                <SettingsPage />
              </SuspensedView>
            </RoleGuard>
          }
        />

        <Route path="/apps/*" element={<Navigate to={homeRoute} replace />} />

        <Route
          path="crafted/account/*"
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />

        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
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

export {PrivateRoutes}
