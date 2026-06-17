import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  fetchInquiryRequestsApi,
  createInquiryRequestApi,
  updateInquiryRequestApi,
  deleteInquiryRequestApi,
  approveInquiryRequestApi,
  rejectInquiryRequestApi,
} from "./inquiry_request.api";

import { mapInquiryRequest } from "./inquiry_request.mapper";

import type { InquiryRequest, InquiryRequestFormValues } from "./inquiry_request.types";

import type { GetInquiryRequestParams } from "./inquiry_request.api";

type ReviewPayload = {
  admin_notes?: string | null;
  create_order?: boolean;
  Inquiry_id?: string | null;
  organization_id?: string | null;
};

type InquiryRequestState = {
  data: InquiryRequest[];
  total: number;
  loading: boolean;
  error: string | null;

  isModalOpen: boolean;
  editingRequest: InquiryRequest | null;

  reviewingRequest: InquiryRequest | null;
  reviewAction: "approve" | "reject" | null;
  deleteModalOpen: boolean;
  deletingRequest: InquiryRequest | null;
  saving: boolean;
};

const initialState: InquiryRequestState = {
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

export const fetchInquiryRequests = createAsyncThunk(
  "InquiryRequests/fetch",
  async (params: GetInquiryRequestParams) => {
    const res = await fetchInquiryRequestsApi(params);

    return {
      data: res.data.map(mapInquiryRequest),
      total: res.total,
    };
  },
);

export const saveInquiryRequest = createAsyncThunk(
  "InquiryRequests/save",
  async (payload: { id?: string; values: InquiryRequestFormValues }) => {
    if (payload.id) {
      await updateInquiryRequestApi(payload.id, payload.values);
    } else {
      await createInquiryRequestApi(payload.values);
    }
  },
);

export const deleteInquiryRequest = createAsyncThunk(
  "InquiryRequests/delete",
  async (id: string) => {
    await deleteInquiryRequestApi(id);
    return id;
  },
);

export const approveInquiryRequest = createAsyncThunk(
  "InquiryRequests/approve",
  async ({ id, payload }: { id: string; payload: ReviewPayload }) => {
    const res = await approveInquiryRequestApi(id, payload);

    return res;
  },
);

export const rejectInquiryRequest = createAsyncThunk(
  "InquiryRequests/reject",
  async ({ id, payload }: { id: string; payload: ReviewPayload }) => {
    const res = await rejectInquiryRequestApi(id, payload);

    return res;
  },
);

const InquiryRequestSlice = createSlice({
  name: "InquiryRequests",

  initialState,

  reducers: {
    openInquiryRequestModal(state, action: PayloadAction<InquiryRequest | null>) {
      state.isModalOpen = true;
      state.editingRequest = action.payload;
    },

    closeInquiryRequestModal(state) {
      state.isModalOpen = false;
      state.editingRequest = null;
    },

    openReviewModal(
      state,
      action: PayloadAction<{
        request: InquiryRequest;
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
    openDeleteInquiryRequestModal(state, action: PayloadAction<InquiryRequest>) {
      state.deleteModalOpen = true;
      state.deletingRequest = action.payload;
    },

    closeDeleteInquiryRequestModal(state) {
      state.deleteModalOpen = false;
      state.deletingRequest = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchInquiryRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchInquiryRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })

      .addCase(fetchInquiryRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch Inquiry requests";
      })

      .addCase(saveInquiryRequest.pending, (state) => {
        state.saving = true;
      })

      .addCase(saveInquiryRequest.fulfilled, (state) => {
        state.saving = false;
        state.isModalOpen = false;
        state.editingRequest = null;
      })

      .addCase(saveInquiryRequest.rejected, (state) => {
        state.saving = false;
      })

      .addCase(deleteInquiryRequest.pending, (state) => {
        state.saving = true;
      })

      .addCase(deleteInquiryRequest.fulfilled, (state, action) => {
        state.saving = false;

        state.data = state.data.filter((item) => item.id !== action.payload);

        state.deleteModalOpen = false;
        state.deletingRequest = null;
      })

      .addCase(deleteInquiryRequest.rejected, (state) => {
        state.saving = false;
      })

      .addCase(approveInquiryRequest.pending, (state) => {
        state.saving = true;
      })

      .addCase(approveInquiryRequest.fulfilled, (state, action) => {
        state.saving = false;

        const updated = mapInquiryRequest(action.payload.data ?? action.payload);

        const index = state.data.findIndex((item) => item.id === updated.id);

        if (index !== -1) {
          state.data[index] = updated;
        }

        state.reviewingRequest = null;
        state.reviewAction = null;
      })

      .addCase(approveInquiryRequest.rejected, (state) => {
        state.saving = false;
      })

      .addCase(rejectInquiryRequest.pending, (state) => {
        state.saving = true;
      })

      .addCase(rejectInquiryRequest.fulfilled, (state, action) => {
        state.saving = false;

        const updated = mapInquiryRequest(action.payload.data ?? action.payload);

        const index = state.data.findIndex((item) => item.id === updated.id);

        if (index !== -1) {
          state.data[index] = updated;
        }

        state.reviewingRequest = null;
        state.reviewAction = null;
      })

      .addCase(rejectInquiryRequest.rejected, (state) => {
        state.saving = false;
      });
  },
});

export const {
  openInquiryRequestModal,
  closeInquiryRequestModal,
  openReviewModal,
  closeReviewModal,
  openDeleteInquiryRequestModal,
  closeDeleteInquiryRequestModal,
} = InquiryRequestSlice.actions;

export default InquiryRequestSlice.reducer;
