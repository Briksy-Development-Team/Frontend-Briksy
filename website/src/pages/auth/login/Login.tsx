import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Brandpanel from '../../../assets/login/loginleft.png'
import BriksyLogo from '../../../assets/logo/briskybrown.svg'
import { useAuth } from '../../../auth/AuthContext'
import { clearPendingFavoriteAction, readPendingFavoriteAction } from '../../../auth/auth.intent'
import { toggleSeekerPropertyFavorite } from '../../../seeker/seeker.api'
import { LoginScreen } from './LoginScreen'

const Login = () => {
  const { isAuthenticated, isBootstrapping } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectingRef = useRef(false)

  const fromPath = (location.state as { from?: string } | null)?.from ?? '/account/profile'

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated || redirectingRef.current) {
      return
    }

    redirectingRef.current = true
    const pending = readPendingFavoriteAction()

    const finish = async (): Promise<void> => {
      try {
        if (pending?.type === 'favorite' && pending.propertyId) {
          await toggleSeekerPropertyFavorite(pending.propertyId)
          clearPendingFavoriteAction()
          navigate(pending.fromPath ?? fromPath, { replace: true })
          return
        }

        navigate(fromPath, { replace: true })
      } catch (error) {
        console.error('Failed to complete pending seeker action.', error)
        navigate(fromPath, { replace: true })
      }
    }

    void finish()
  }, [fromPath, isAuthenticated, isBootstrapping, navigate])

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 py-4 font-helvetica sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1080px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_60px_rgba(52,37,17,0.3)]">
        <aside className="relative hidden w-[26.875rem] shrink-0 md:block">
          <img src={Brandpanel} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a110a]/20 via-[#1a110a]/40 to-[#1a110a]/80" />
          <div className="absolute left-6 top-6 z-10">
            <img src={BriksyLogo} alt="Briksy" className="h-7 w-auto brightness-0 invert" />
          </div>
          <div className="absolute left-6 right-6 top-20 z-10">
            <h2 className="text-[1.875rem] font-medium leading-[1.2] tracking-[-0.03em] text-[#eeece0]">
              Welcome back
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#eeece0]/80">
              Sign in to manage your likes, enquiries and account activity on Briksy.
            </p>
          </div>
          <div className="absolute bottom-6 left-6 right-6 z-10 text-sm text-[#eeece0]/85">
            New here?{' '}
            <Link to="/register" className="underline underline-offset-2 transition hover:text-white">
              Create an account
            </Link>
          </div>
        </aside>

        <main className="flex flex-1 items-center justify-center">
          <LoginScreen />
        </main>
      </div>
    </div>
  )
}

export default Login
