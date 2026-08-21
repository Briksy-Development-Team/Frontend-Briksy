import { useMemo } from 'react'
import { useAuth } from './core/Auth'
import { useRoleAccess } from './useRoleAccess'

export const useModuleAccess = () => {
  const { enabledModules = [] } = useAuth()
  const { isSuperAdmin } = useRoleAccess()

  return useMemo(() => {
    const modules = (enabledModules ?? []).map(String)

    const hasModule = (module: string) => {
      if (isSuperAdmin) {
        return true
      }

      return modules.includes(module)
    }

    const hasAnyModule = (required: string[]) => {
      if (isSuperAdmin) {
        return true
      }

      return required.some((module) => modules.includes(module))
    }

    return {
      modules,
      hasModule,
      hasAnyModule,
      isSuperAdmin,
    }
  }, [enabledModules, isSuperAdmin])
}
