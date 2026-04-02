import { useAuth } from '.'
import {
  canAccessDashboard,
  canManageBusinesses,
  canManageProperties,
  canManageSeekers,
  canManageServices,
  canManageStaff,
  canManageSubscriptions,
  isAdminStaff,
} from './core/roleRoutes'

export const useRoleAccess = () => {
  const { currentUser } = useAuth()

  return {
    currentUser,
    isAdminStaff: isAdminStaff(currentUser),
    canAccessDashboard: canAccessDashboard(currentUser),
    canManageSeekers: canManageSeekers(currentUser),
    canManageBusinesses: canManageBusinesses(currentUser),
    canManageStaff: canManageStaff(currentUser),
    canManageSubscriptions: canManageSubscriptions(currentUser),
    canManageProperties: canManageProperties(currentUser),
    canManageServices: canManageServices(currentUser),
  }
}
