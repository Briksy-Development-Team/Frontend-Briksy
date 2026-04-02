import {Navigate, Outlet, useLocation} from 'react-router-dom'
import {useAuth} from '../auth/AuthContext'

const ProtectedRoute = () => {
  const {isAuthenticated, isBootstrapping} = useAuth()
  const location = useLocation()

  if (isBootstrapping) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white'>
        <p className='text-sm tracking-wide text-zinc-400'>Loading your account...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{from: location.pathname}} />
  }

  return <Outlet />
}

export default ProtectedRoute
