/* eslint-disable react-refresh/only-export-components */
import { type FC, useEffect } from 'react'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { WithChildren } from '../../../../_metronic/helpers'
import { clearSession, setAuth as setAuthState, setBootstrapping, setCurrentUser } from './auth.store'
import { getAuth, removeAuth, setAuth as persistAuth } from './AuthHelpers'
import { getUserByToken, login as loginRequest, logout as logoutRequest, register as registerRequest } from './_requests'
import type { AuthModel, AuthResponse, UserModel } from './_models'
import type { AppDispatch, RootState } from '../../../services/store'

type AuthContextProps = {
  auth: AuthModel | undefined
  currentUser: UserModel | undefined
  isBootstrapping: boolean
  saveAuth: (auth: AuthModel | undefined) => void
  setCurrentUser: (user: UserModel | undefined) => void
  logout: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (payload: {
    first: string
    last: string
    email: string
    password: string
    password_confirmation: string
  }) => Promise<void>
}

const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector

const mapAuthResponse = (response: AuthResponse): AuthModel => ({
  api_token: response.token,
  token_type: response.token_type,
  abilities: response.abilities,
})

const bootstrapSession = async (dispatch: AppDispatch): Promise<void> => {
  dispatch(setBootstrapping(true))

  const storedAuth = getAuth()

  if (!storedAuth?.api_token) {
    dispatch(clearSession())
    dispatch(setBootstrapping(false))
    return
  }

  try {
    const data = await getUserByToken()

    dispatch(setAuthState(storedAuth))
    dispatch(setCurrentUser(data.data.user))
  } catch (error) {
    console.error('Failed to restore admin session.', error)
    removeAuth()
    dispatch(clearSession())
  } finally {
    dispatch(setBootstrapping(false))
  }
}

const AuthInit: FC<WithChildren> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    void bootstrapSession(dispatch)
  }, [dispatch])

  return <>{children}</>
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
  return <>{children}</>
}

const useAuth = (): AuthContextProps => {
  const dispatch = useDispatch<AppDispatch>()
  const authState = useAuthSelector((state) => state.auth)

  const saveAuth = (auth: AuthModel | undefined) => {
    dispatch(setAuthState(auth))

    if (auth) {
      persistAuth(auth)
    } else {
      removeAuth()
    }
  }

  const updateCurrentUser = (user: UserModel | undefined) => {
    dispatch(setCurrentUser(user))
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } catch (error) {
      console.error('Logout request failed.', error)
    } finally {
      removeAuth()
      dispatch(clearSession())
    }
  }

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email.trim(), password)
    const auth = mapAuthResponse(data.data)

    saveAuth(auth)
    updateCurrentUser(data.data.user)
  }

  const register = async (payload: {
    first: string
    last: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    const normalizedPayload = {
      first: payload.first.trim(),
      last: payload.last.trim(),
      email: payload.email.trim(),
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    }

    const data = await registerRequest(normalizedPayload)
    const auth = mapAuthResponse(data.data)

    saveAuth(auth)
    updateCurrentUser(data.data.user)
  }

  return {
    auth: authState.auth,
    currentUser: authState.currentUser,
    isBootstrapping: authState.isBootstrapping,
    saveAuth,
    setCurrentUser: updateCurrentUser,
    logout,
    login,
    register,
  }
}

export { AuthProvider, AuthInit, useAuth }
