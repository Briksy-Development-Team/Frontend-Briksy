import {configureStore} from '@reduxjs/toolkit'
import seekerReducer from '../features/seeker/seekerSlice'
import authReducer from '../../modules/auth/core/auth.store'

export const store = configureStore({
  reducer: {
    seeker: seekerReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
