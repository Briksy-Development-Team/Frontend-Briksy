import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  fetchPlansApi,
  createPlanApi,
  updatePlanApi,
  deletePlanApi,
  changePlanApi,
} from "./plan.api";
import type { Plan, PlanFormValues, PlanSubscriptionSummary } from "./plan.types";

type PlanState = {
  data: Plan[];
  subscription: PlanSubscriptionSummary | null;
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingPlan: Plan | null;
  saving: boolean;
  changing: boolean;
};

const initialState: PlanState = {
  data: [],
  subscription: null,
  loading: false,
  error: null,
  isModalOpen: false,
  editingPlan: null,
  saving: false,
  changing: false,
};

export const fetchPlans = createAsyncThunk("plans/fetch", async () => {
  return await fetchPlansApi();
});

export const savePlan = createAsyncThunk(
  "plans/save",
  async (payload: { id?: string; values: PlanFormValues }) => {
    if (payload.id) {
      return await updatePlanApi(payload.id, payload.values);
    }
    return await createPlanApi(payload.values);
  },
);

export const removePlan = createAsyncThunk(
  "plans/delete",
  async (id: string) => {
    await deletePlanApi(id);
    return id;
  },
);

// Admin selects/changes their plan
export const changePlan = createAsyncThunk(
  "plans/changePlan",
  async (planId: string) => {
    return await changePlanApi(planId);
  },
);

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    openPlanModal(state, action: PayloadAction<Plan | null>) {
      state.isModalOpen = true;
      state.editingPlan = action.payload;
    },
    closePlanModal(state) {
      state.isModalOpen = false;
      state.editingPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.plans;
        state.subscription = action.payload.subscription ?? null;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load plans";
      })

      .addCase(savePlan.pending, (state) => {
        state.saving = true;
      })
      .addCase(savePlan.fulfilled, (state, action) => {
        state.saving = false;
        state.isModalOpen = false;
        state.editingPlan = null;
        const idx = state.data.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
        else state.data.push(action.payload);
      })
      .addCase(savePlan.rejected, (state) => {
        state.saving = false;
      })

      .addCase(removePlan.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload);
      })

      // mark the newly selected plan as current, unmark the rest
      .addCase(changePlan.pending, (state) => {
        state.changing = true;
      })
      .addCase(changePlan.fulfilled, (state, action) => {
        state.changing = false;
        const selectedId = action.payload?.plan?.id ?? "";
        state.data = state.data.map((p) => ({
          ...p,
          is_current: p.id === selectedId,
        }));
        if (state.subscription) {
          state.subscription = {
            ...state.subscription,
            status: "active",
            is_trial_active: false,
            plan: action.payload?.subscription?.plan ?? action.payload?.plan ?? state.subscription.plan,
          };
        }
      })
      .addCase(changePlan.rejected, (state) => {
        state.changing = false;
      });
  },
});

export const { openPlanModal, closePlanModal } = planSlice.actions;
export default planSlice.reducer;
