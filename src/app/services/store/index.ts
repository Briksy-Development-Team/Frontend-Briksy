import { configureStore } from "@reduxjs/toolkit";
import seekerReducer from "../features/seeker/seekerSlice";
import organizationReducer from "../features/organization/orgrSlice";
// import soloReducer from "../features/solo/soloSlice";
import staffReducer from "../features/staff/staffSlice";
import ServiceGroupReducer from "../features/service_group/service_groupSlice";


import authReducer from "../../modules/auth/core/auth.store";

export const store = configureStore({
  reducer: {
    seeker: seekerReducer,
    organization: organizationReducer,
    // solo: soloReducer,
    staff: staffReducer,
    ServiceGroup: ServiceGroupReducer,

    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
