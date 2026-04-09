import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSeekersApi, type GetSeekersParams } from "./seekerApi";
import { mapSeeker } from "./seekerMapper";
import type { Seeker } from "./seeker.types";

type SeekerState = {
  data: Seeker[];
  total: number;
  loading: boolean;
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

    console.log("API RAW RESPONSE:", res);

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
      .addCase(fetchSeekers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeekers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchSeekers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch seekers";
      });
  },
});

export default seekerSlice.reducer;
