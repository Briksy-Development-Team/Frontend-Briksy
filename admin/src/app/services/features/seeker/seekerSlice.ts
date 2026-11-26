import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSeekersApi } from "./seekerApi";
import { mapSeeker } from "./seekerMapper";
import type { Seeker, GetSeekersParams } from "./seeker.types";

type SeekerState = {
  data: Seeker[];
  total: number;
  loading: boolean;
  listRequestId?: string;
  error: string | null;
};

const initialState: SeekerState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchSeekers = createAsyncThunk(
  "seeker/fetch",
  async (params: GetSeekersParams) => {
    const res = await fetchSeekersApi(params);

    return {
      data: res.data.map(mapSeeker),
      total: res.total,
    };
  },
);

const seekerSlice = createSlice({
  name: "seeker",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeekers.pending, (state, action) => {
        state.listRequestId = action.meta.requestId;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeekers.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.listRequestId = undefined;
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchSeekers.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.listRequestId = undefined;
        state.loading = false;
        state.error = action.error.message || "Failed to fetch end users";
      });
  },
});

export default seekerSlice.reducer;
