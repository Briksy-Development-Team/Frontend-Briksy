import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchInquiriesApi, type GetInquiryParams } from "./inquiry.api";
import { mapInquiry } from "./inquiry.mapper";
import type { Inquiry } from "./inquiry.types";

type InquiryState = {
  data: Inquiry[];
  total: number;
  loading: boolean;
  listRequestId?: string;
  error: string | null;
};

const initialState: InquiryState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchInquiries = createAsyncThunk(
  "inquiries/fetch",
  async (params: GetInquiryParams) => {
    const res = await fetchInquiriesApi(params);

    return {
      data: res.data.map(mapInquiry),
      total: res.total,
    };
  },
);

const inquirySlice = createSlice({
  name: "inquiries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (state, action) => {
        state.listRequestId = action.meta.requestId;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.listRequestId = undefined;
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.listRequestId = undefined;
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch inquiries";
      });
  },
});

export default inquirySlice.reducer;
