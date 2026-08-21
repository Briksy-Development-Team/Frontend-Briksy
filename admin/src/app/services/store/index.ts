import { configureStore } from "@reduxjs/toolkit";
import seekerReducer from "../features/seeker/seekerSlice";
import organizationReducer from "../features/organization/organization.slice";
// import soloReducer from "../features/solo/soloSlice";
import staffReducer from "../features/staff/staff.slice";
import servicesReducer from "../features/service/service_service_list.slice";
import emailTemplatesReducer from "../features/email_template/email-template.slice";
import authReducer from "../../modules/auth/core/auth.store";
import plansReducer from "../features/subscriptions/plan.slice";
import propertyListReducer from "../features/properties/property.slice";
import orderReducer from "../features/orders/order.slice";
import planRequestReducer from "../features/plan_requests/plan-request.slice";
import couponReducer from "../features/coupons/coupon.slice";
// import propertiesReducer from "../features/properties/property.slice";
export const store = configureStore({
  reducer: {
    seeker: seekerReducer,
    organization: organizationReducer,
    // solo: soloReducer,
    staff: staffReducer,
    plans: plansReducer,
    services: servicesReducer,
    emailTemplates: emailTemplatesReducer,
    propertyList: propertyListReducer,
    orders: orderReducer,
    planRequests: planRequestReducer,
    coupons: couponReducer,
    // coupons: couponReducer,

    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
