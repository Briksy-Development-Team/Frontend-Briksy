import {useMemo} from 'react'
import {useAuth} from './core/Auth'

export const useRoleAccess = () => {
  const {auth, currentUser} = useAuth()

  return useMemo(() => {
    const roles = (currentUser?.roles ?? auth?.abilities ?? []).map(String)

    return {
      roles,
      isSuperAdmin: roles.includes('super_admin'),
      isAdmin: roles.includes('admin') || roles.includes('admin_staff'),
      hasAnyRole: roles.length > 0,
    }
  }, [auth?.abilities, currentUser?.roles])
}
