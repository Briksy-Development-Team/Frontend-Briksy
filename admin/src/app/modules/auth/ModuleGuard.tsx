import { type FC, type PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useModuleAccess } from './useModuleAccess'

type ModuleGuardProps = PropsWithChildren<{
  anyOf?: string[]
}>

const ModuleGuard: FC<ModuleGuardProps> = ({ anyOf = [], children }) => {
  const { hasAnyModule, modules } = useModuleAccess()
  const location = useLocation()

  const allowed = anyOf.length === 0 || hasAnyModule(anyOf)

  if (!allowed) {
    return <Navigate to="/error/403" state={{ from: location, modules }} replace />
  }

  return <>{children}</>
}

export { ModuleGuard }
