import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {getAuth} from './AuthHelpers'
import type {AuthModel, UserModel} from './_models'

export interface AdminAuthState {
  auth: AuthModel | undefined
  currentUser: UserModel | undefined
  isBootstrapping: boolean
}

const getInitialState = (): AdminAuthState => ({
  auth: getAuth(),
  currentUser: undefined,
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
    },
    clearSession(state) {
      state.auth = undefined
      state.currentUser = undefined
      state.isBootstrapping = false
    },
  },
})

export const {setBootstrapping, setAuth, setCurrentUser, clearSession} = authSlice.actions

export default authSlice.reducer
