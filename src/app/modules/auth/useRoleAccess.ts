import {useMemo} from 'react'
import {useAuth} from './core/Auth'

export const useRoleAccess = () => {
  const {auth, currentUser} = useAuth()

  return useMemo(() => {
    const roles = currentUser?.roles?.map(String) ?? auth?.abilities ?? []

    return {
      roles,
      isAdmin: roles.includes('super_admin'),
      // isAdminStaff: roles.includes('admin_staff'),
      hasAnyRole: roles.length > 0,
    }
  }, [auth?.abilities, currentUser?.roles])
}
