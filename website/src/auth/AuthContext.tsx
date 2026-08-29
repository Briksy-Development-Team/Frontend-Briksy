/* eslint-disable react-refresh/only-export-components */
import { AxiosError } from 'axios'
import { type FC, type ReactNode, useEffect, useMemo } from 'react'
import { Provider, type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  bootstrapSeekerAuth,
  clearSession,
  loginSeekerSession,
  logoutSeekerSession,
  registerSeekerSession,
  seekerAuthStore,
  type SeekerAuthDispatch,
  type SeekerAuthRootState,
} from './auth.store'
import { clearStoredAuth } from './auth.storage'
import type { AuthRole, AuthUser, LoginPayload, RegisterPayload } from './auth.types'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  abilities: string[]
  roles: AuthRole[]
  isAuthenticated: boolean
  isSeeker: boolean
  isBootstrapping: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

const useSeekerAuthSelector: TypedUseSelectorHook<SeekerAuthRootState> = useSelector

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      'Something went wrong while contacting the server.'

    return message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong while contacting the server.'
}

const AuthBootstrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<SeekerAuthDispatch>()

  useEffect(() => {
    void bootstrapSeekerAuth(dispatch)
  }, [dispatch])

  useEffect(() => {
    const handleUnauthorized = () => {
      clearStoredAuth()
      dispatch(clearSession())
    }

    window.addEventListener('briksy:seeker-auth-unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('briksy:seeker-auth-unauthorized', handleUnauthorized)
    }
  }, [dispatch])

  return <>{children}</>
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={seekerAuthStore}>
      <AuthBootstrapper>{children}</AuthBootstrapper>
    </Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const dispatch = useDispatch<SeekerAuthDispatch>()
  const auth = useSeekerAuthSelector((state) => state.seekerAuth)

  return useMemo<AuthContextValue>(
    () => ({
      user: auth.user,
      token: auth.token,
      abilities: auth.abilities,
      roles: auth.roles,
      isAuthenticated: auth.isAuthenticated,
      isSeeker: auth.roles.length === 1 && auth.roles[0] === 'seeker',
      isBootstrapping: auth.isBootstrapping,
      login: async (payload: LoginPayload) => {
        await loginSeekerSession(dispatch, payload)
      },
      register: async (payload: RegisterPayload) => {
        await registerSeekerSession(dispatch, payload)
      },
      logout: async () => {
        await logoutSeekerSession(dispatch)
      },
    }),
    [auth, dispatch]
  )
}

export const getAuthErrorMessage = getErrorMessage
