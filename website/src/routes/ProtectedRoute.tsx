import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useIsMobileApp } from '../utils/platform'
import AppGuestAuth from '../mobile_app/pages/auth/AppGuestAuth'

const ProtectedRoute = () => {
  const { isAuthenticated, isBootstrapping, isSeeker } = useAuth()
  const location = useLocation()
  const isApp = useIsMobileApp()
  const [isMobileScreen, setIsMobileScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f4ee] text-[#342511]">
        <p className="text-sm tracking-wide text-[#7c5f42]">Loading your account...</p>
      </div>
    )
  }

  if (!isAuthenticated || !isSeeker) {
    if (isApp || isMobileScreen) {
      return <AppGuestAuth />
    }
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}

export default ProtectedRoute
