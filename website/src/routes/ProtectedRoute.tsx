import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const ProtectedRoute = () => {
  const { isAuthenticated, isBootstrapping, isSeeker } = useAuth()
  const location = useLocation()

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f4ee] text-[#342511]">
        <p className="text-sm tracking-wide text-[#7c5f42]">Loading your account...</p>
      </div>
    )
  }

  if (!isAuthenticated || !isSeeker) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}

export default ProtectedRoute
