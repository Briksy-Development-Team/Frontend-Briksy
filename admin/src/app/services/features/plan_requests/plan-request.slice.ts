import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  fetchPlanRequestsApi,
  createPlanRequestApi,
  updatePlanRequestApi,
  deletePlanRequestApi,
  approvePlanRequestApi,
  rejectPlanRequestApi,
} from "./plan-request.api";

import { mapPlanRequest } from "./plan-request.mapper";

import type {
  PlanRequest,
  PlanRequestFormValues,
  PlanRequestReviewValues,
} from "./plan-request.types";

import type { GetPlanRequestParams } from "./plan-request.api";

type PlanRequestState = {
  data: PlanRequest[];
  total: number;
  loading: boolean;
  error: string | null;

  isModalOpen: boolean;
  editingRequest: PlanRequest | null;

  reviewingRequest: PlanRequest | null;
  reviewAction: "approve" | "reject" | null;
  deleteModalOpen: boolean;
  deletingRequest: PlanRequest | null;
  saving: boolean;
};

const initialState: PlanRequestState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
  deleteModalOpen: false,
  deletingRequest: null,
  isModalOpen: false,
  editingRequest: null,

  reviewingRequest: null,
  reviewAction: null,

  saving: false,
};

export const fetchPlanRequests = createAsyncThunk(
  "planRequests/fetch",
  async (params: GetPlanRequestParams) => {
    const res = await fetchPlanRequestsApi(params);

    return {
      data: res.data.map(mapPlanRequest),
      total: res.total,
    };
  },
);

export const savePlanRequest = createAsyncThunk(
  "planRequests/save",
  async (payload: { id?: string; values: PlanRequestFormValues }) => {
    if (payload.id) {
      await updatePlanRequestApi(payload.id, payload.values);
    } else {
      await createPlanRequestApi(payload.values);
    }
  },
);

export const deletePlanRequest = createAsyncThunk(
  "planRequests/delete",
  async (id: string) => {
    await deletePlanRequestApi(id);
    return id;
  },
);

export const approvePlanRequest = createAsyncThunk(
  "planRequests/approve",
  async ({ id, payload }: { id: string; payload: PlanRequestReviewValues }) => {
    const res = await approvePlanRequestApi(id, payload);

    return res;
  },
);

export const rejectPlanRequest = createAsyncThunk(
  "planRequests/reject",
  async ({ id, payload }: { id: string; payload: PlanRequestReviewValues }) => {
    const res = await rejectPlanRequestApi(id, payload);

    return res;
  },
);

const planRequestSlice = createSlice({
  name: "planRequests",

  initialState,

  reducers: {
    openPlanRequestModal(state, action: PayloadAction<PlanRequest | null>) {
      state.isModalOpen = true;
      state.editingRequest = action.payload;
    },

    closePlanRequestModal(state) {
      state.isModalOpen = false;
      state.editingRequest = null;
    },

    openReviewModal(
      state,
      action: PayloadAction<{
        request: PlanRequest;
        actionType: "approve" | "reject";
      }>,
    ) {
      state.reviewingRequest = action.payload.request;

      state.reviewAction = action.payload.actionType;
    },

    closeReviewModal(state) {
      state.reviewingRequest = null;
      state.reviewAction = null;
    },
    openDeletePlanRequestModal(state, action: PayloadAction<PlanRequest>) {
      state.deleteModalOpen = true;
      state.deletingRequest = action.payload;
    },

    closeDeletePlanRequestModal(state) {
      state.deleteModalOpen = false;
      state.deletingRequest = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchPlanRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPlanRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })

      .addCase(fetchPlanRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch plan requests";
      })

      .addCase(savePlanRequest.pending, (state) => {
        state.saving = true;
      })

      .addCase(savePlanRequest.fulfilled, (state) => {
        state.saving = false;
        state.isModalOpen = false;
        state.editingRequest = null;
      })

      .addCase(savePlanRequest.rejected, (state) => {
        state.saving = false;
      })

      .addCase(deletePlanRequest.pending, (state) => {
        state.saving = true;
      })

      .addCase(deletePlanRequest.fulfilled, (state, action) => {
        state.saving = false;

        state.data = state.data.filter((item) => item.id !== action.payload);

        state.deleteModalOpen = false;
        state.deletingRequest = null;
      })

      .addCase(deletePlanRequest.rejected, (state) => {
        state.saving = false;
      })

      .addCase(approvePlanRequest.pending, (state) => {
        state.saving = true;
      })

      .addCase(approvePlanRequest.fulfilled, (state, action) => {
        state.saving = false;

        const updated = mapPlanRequest(action.payload.data ?? action.payload);

        const index = state.data.findIndex((item) => item.id === updated.id);

        if (index !== -1) {
          state.data[index] = updated;
        }

        state.reviewingRequest = null;
        state.reviewAction = null;
      })

      .addCase(approvePlanRequest.rejected, (state) => {
        state.saving = false;
      })

      .addCase(rejectPlanRequest.pending, (state) => {
        state.saving = true;
      })

      .addCase(rejectPlanRequest.fulfilled, (state, action) => {
        state.saving = false;

        const updated = mapPlanRequest(action.payload.data ?? action.payload);

        const index = state.data.findIndex((item) => item.id === updated.id);

        if (index !== -1) {
          state.data[index] = updated;
        }

        state.reviewingRequest = null;
        state.reviewAction = null;
      })

      .addCase(rejectPlanRequest.rejected, (state) => {
        state.saving = false;
      });
  },
});

export const {
  openPlanRequestModal,
  closePlanRequestModal,
  openReviewModal,
  closeReviewModal,
  openDeletePlanRequestModal,
  closeDeletePlanRequestModal,
} = planRequestSlice.actions;

export default planRequestSlice.reducer;
