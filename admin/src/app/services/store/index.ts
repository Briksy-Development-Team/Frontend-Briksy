import { configureStore } from "@reduxjs/toolkit";
import seekerReducer from "../features/seeker/seekerSlice";
import staffReducer from "../features/staff/staffSlice";
import organizationReducer from "../features/organization/organizationSlice";

export const store = configureStore({
  reducer: {
    seeker: seekerReducer,
    staff: staffReducer,
    organization: organizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;