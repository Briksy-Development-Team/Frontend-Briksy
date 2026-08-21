import {configureStore, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {getSeekerProfile, loginSeeker, logoutSeeker, registerSeeker} from './auth.api'
import {clearStoredAuth, getStoredAuth, setStoredAuth} from './auth.storage'
import type {AuthResponse, AuthUser, LoginPayload, RegisterPayload, StoredAuth} from './auth.types'

export interface SeekerAuthState {
  user: AuthUser | null
  token: string | null
  tokenType: string | null
  abilities: string[]
  isAuthenticated: boolean
  isBootstrapping: boolean
}

const createInitialState = (): SeekerAuthState => {
  const storedAuth = getStoredAuth()

  return {
    user: storedAuth?.user ?? null,
    token: storedAuth?.token ?? null,
    tokenType: storedAuth?.tokenType ?? null,
    abilities: storedAuth?.abilities ?? [],
    isAuthenticated: Boolean(storedAuth?.token),
    isBootstrapping: true,
  }
}

const buildStoredAuth = (response: AuthResponse): StoredAuth => ({
  token: response.token,
  tokenType: response.token_type,
  abilities: response.abilities,
  user: response.user,
})

const seekerAuthSlice = createSlice({
  name: 'seekerAuth',
  initialState: createInitialState(),
  reducers: {
    setBootstrapping(state, action: PayloadAction<boolean>) {
      state.isBootstrapping = action.payload
    },
    setSession(state, action: PayloadAction<StoredAuth>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.tokenType = action.payload.tokenType
      state.abilities = action.payload.abilities
      state.isAuthenticated = true
      state.isBootstrapping = false
    },
    clearSession(state) {
      state.user = null
      state.token = null
      state.tokenType = null
      state.abilities = []
      state.isAuthenticated = false
      state.isBootstrapping = false
    },
  },
})

export const {setBootstrapping, setSession, clearSession} = seekerAuthSlice.actions

export const seekerAuthStore = configureStore({
  reducer: {
    seekerAuth: seekerAuthSlice.reducer,
  },
})

export type SeekerAuthRootState = ReturnType<typeof seekerAuthStore.getState>
export type SeekerAuthDispatch = typeof seekerAuthStore.dispatch

export const bootstrapSeekerAuth = async (dispatch: SeekerAuthDispatch): Promise<void> => {
  dispatch(setBootstrapping(true))

  const storedAuth = getStoredAuth()

  if (!storedAuth?.token) {
    dispatch(clearSession())
    return
  }

  try {
    const response = await getSeekerProfile()
    const nextAuth: StoredAuth = {
      ...storedAuth,
      user: response.data.user,
    }

    setStoredAuth(nextAuth)
    dispatch(setSession(nextAuth))
  } catch (error) {
    console.error('Failed to restore seeker auth session.', error)
    clearStoredAuth()
    dispatch(clearSession())
  }
}

export const loginSeekerSession = async (
  dispatch: SeekerAuthDispatch,
  payload: LoginPayload
): Promise<void> => {
  const response = await loginSeeker({
    email: payload.email.trim(),
    password: payload.password,
  })

  const nextAuth = buildStoredAuth(response.data)

  setStoredAuth(nextAuth)
  dispatch(setSession(nextAuth))
}

export const registerSeekerSession = async (
  dispatch: SeekerAuthDispatch,
  payload: RegisterPayload
): Promise<void> => {
  const normalizedPayload = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    password: payload.password,
    password_confirmation: payload.password_confirmation,
  }

  await registerSeeker(normalizedPayload)
  await loginSeekerSession(dispatch, {
    email: normalizedPayload.email,
    password: normalizedPayload.password,
  })
}

export const logoutSeekerSession = async (dispatch: SeekerAuthDispatch): Promise<void> => {
  try {
    await logoutSeeker()
  } catch (error) {
    console.error('Logout request failed.', error)
  } finally {
    clearStoredAuth()
    dispatch(clearSession())
  }
}
