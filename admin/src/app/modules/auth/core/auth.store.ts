import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {getAuth} from './AuthHelpers'
import type {AuthModel, EntitlementModel, UserModel} from './_models'

export interface AdminAuthState {
  auth: AuthModel | undefined
  currentUser: UserModel | undefined
  permissions: string[]
  enabledModules: string[]
  businessType: string | null
  businessVerificationStatus: string | null
  entitlements: EntitlementModel | undefined
  isBootstrapping: boolean
}

const getInitialState = (): AdminAuthState => ({
  auth: getAuth(),
  currentUser: undefined,
  permissions: [],
  enabledModules: [],
  businessType: null,
  businessVerificationStatus: null,
  entitlements: undefined,
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
      state.businessType = action.payload?.business_type ?? state.businessType
      state.businessVerificationStatus = action.payload?.business_verification_status ?? state.businessVerificationStatus
      state.entitlements = action.payload?.entitlements ?? state.entitlements
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
    setEnabledModules(state, action: PayloadAction<string[]>) {
      state.enabledModules = action.payload

      if (state.auth) {
        state.auth.enabled_modules = action.payload
      }
    },
    setBusinessProfile(
      state,
      action: PayloadAction<{
        businessType?: string | null
        businessVerificationStatus?: string | null
      }>,
    ) {
      state.businessType = action.payload.businessType ?? state.businessType
      state.businessVerificationStatus =
        action.payload.businessVerificationStatus ?? state.businessVerificationStatus

      if (state.auth) {
        state.auth.business_type = state.businessType
        state.auth.business_verification_status = state.businessVerificationStatus
      }
      if (state.currentUser) {
        state.currentUser.business_type = state.businessType
        state.currentUser.business_verification_status = state.businessVerificationStatus
      }
    },
    setEntitlements(state, action: PayloadAction<EntitlementModel | undefined>) {
      state.entitlements = action.payload
      if (state.auth) state.auth.entitlements = action.payload
      if (state.currentUser) state.currentUser.entitlements = action.payload
    },
    clearSession(state) {
      state.auth = undefined
      state.currentUser = undefined
      state.permissions = []
      state.enabledModules = []
      state.businessType = null
      state.businessVerificationStatus = null
      state.entitlements = undefined
      state.isBootstrapping = false
    },
  },
})

export const {setBootstrapping, setAuth, setCurrentUser, setPermissions, setEnabledModules, setBusinessProfile, setEntitlements, clearSession} = authSlice.actions

export default authSlice.reducer
