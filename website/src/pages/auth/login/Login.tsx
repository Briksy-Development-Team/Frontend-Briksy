import { useEffect, useRef, useState, type ComponentType } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Brandpanel from '../../../assets/login/loginleft.png'
import BriksyLogo from '../../../assets/logo/briskybrown.svg'

import { useAuth } from '../../../auth/AuthContext'
import {
  clearPendingFavoriteAction,
  readPendingFavoriteAction,
} from '../../../auth/auth.intent'

import { toggleSeekerPropertyFavorite } from '../../../seeker/seeker.api'

import type { Screen } from '../shared'

import { LoginScreen } from './LoginScreen'
import { ForgotScreen } from './ForgotScreen'
import { LinkSentScreen } from './LinkSentScreen'
import { NewPasswordScreen } from './NewPasswordScreen'
import { UpdatedScreen } from './UpdatedScreen'

const LOGIN_SCREENS: Record<Screen, ComponentType<{ go: (screen: Screen) => void }>> = {
  login: LoginScreen,
  forgot: ForgotScreen,
  'link-sent': LinkSentScreen,
  'new-password': NewPasswordScreen,
  updated: UpdatedScreen,
}

const Login = () => {
  const { isAuthenticated, isBootstrapping } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const redirectingRef = useRef(false)
  const [screen, setScreen] = useState<Screen>('login')

  const fromPath = (location.state as { from?: string } | null)?.from ?? '/account/profile'
  const ScreenComponent = LOGIN_SCREENS[screen]

  useEffect(() => {
    if (
      isBootstrapping ||
      !isAuthenticated ||
      redirectingRef.current
    ) {
      return
    }

    redirectingRef.current = true

    const pending = readPendingFavoriteAction()

    const finish = async (): Promise<void> => {
      try {
        if (pending?.type === 'favorite' && pending.propertyId) {
          await toggleSeekerPropertyFavorite(pending.propertyId)

          clearPendingFavoriteAction()

          navigate(
            pending.fromPath ?? fromPath,
            { replace: true }
          )

          return
        }

        navigate(fromPath, { replace: true })
      } catch (error) {
        console.error(
          'Failed to complete pending seeker action.',
          error
        )

        navigate(fromPath, { replace: true })
      }
    }

    void finish()
  }, [
    fromPath,
    isAuthenticated,
    isBootstrapping,
    navigate,
  ])

  return (
    <div className="h-screen flex items-start sm:items-center justify-center lg:p-4 font-helvetica bg-white">

      <div
        className="
          flex
          rounded-[1.5rem]
          lg:shadow-[0px_24px_60px_0px_rgba(52,37,17,0.3)]
          shadow-none
          overflow-hidden
          w-full
          lg:max-w-[55.5rem]
          lg:bg-white
          mx-auto
          origin-center
          min-h-[38.75rem]
        "
      >

        {/* Left panel */}

        <div
          className="relative shrink-0 hidden lg:block"
          style={{ width: '23.875rem' }}
        >
          <img
            src={Brandpanel}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#1a110a]/20 via-[#1a110a]/40 to-[#1a110a]/80" />

          <div className="absolute left-6 top-6 z-10">
            <img
              src={BriksyLogo}
              alt="Briksy"
              className="h-7 w-auto brightness-0 invert"
            />
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

            <Link
              to="/register"
              className="underline underline-offset-2 transition hover:text-white"
            >
              Create an account
            </Link>
          </div>
        </div>

        <main className="flex flex-1 items-center justify-center">
          <ScreenComponent go={setScreen} />
        </main>
      </div>
    </div>
  )
}

export default Login