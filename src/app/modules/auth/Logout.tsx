import {useEffect} from 'react'
import {Navigate, Routes} from 'react-router-dom'
import {useAuth} from './core/Auth'

export function Logout() {
  const {logout} = useAuth()
  useEffect(() => {
    void logout()
  }, [logout])

  return (
    <Routes>
      <Navigate to='/auth/login' />
    </Routes>
  )
}
