import {useEffect} from 'react'
import {useAuth} from './core/Auth'

export function Logout() {
  const {logout} = useAuth()
  useEffect(() => {
    let active = true

    const completeLogout = async () => {
      if (active) {
        // Redirect before the admin router can turn the current portal URL
        // into /admin/login after the session is cleared.
        await logout('/')
      } else {
        await logout()
      }
    }

    void completeLogout()

    return () => {
      active = false
    }
  }, [logout])

  return <div className='d-flex align-items-center justify-content-center min-vh-100'>Signing out...</div>
}
