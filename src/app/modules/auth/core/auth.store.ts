import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {getAuth} from './AuthHelpers'
import type {AuthModel, UserModel} from './_models'

export interface AdminAuthState {
  auth: AuthModel | undefined
  currentUser: UserModel | undefined
  permissions: string[]
  isBootstrapping: boolean
}

const getInitialState = (): AdminAuthState => ({
  auth: getAuth(),
  currentUser: undefined,
  permissions: [],
  isBootstrapping: true,
})

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setBootstrapping(state, action: PayloadAction<boolean>) {
      state.isBootstrapping = action.payload
    },
    setAuth(state, action: PayloadAction<AuthModel | undefined>) {
      state.auth = action.payload
    },
    setCurrentUser(state, action: PayloadAction<UserModel | undefined>) {
      state.currentUser = action.payload
      state.permissions = action.payload?.permissions ?? []
    },
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload
      if (state.currentUser) {
        state.currentUser.permissions = action.payload
      }
      if (state.auth) {
        state.auth.permissions = action.payload
      }
    },
    clearSession(state) {
      state.auth = undefined
      state.currentUser = undefined
      state.permissions = []
      state.isBootstrapping = false
    },
  },
})

export const {setBootstrapping, setAuth, setCurrentUser, setPermissions, clearSession} = authSlice.actions

export default authSlice.reducer
