import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSeekersApi } from "./seekerApi";
import { mapSeeker } from "./seekerMapper";

type Seeker = {
  id: number;
  name: string;
  email: string;
  status?: string;
  last_login?: string;
  age?: number;
  gender?: string;
  location?: string;
};

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

    return {
      data: res.data.map(mapSeeker),
      total: res.total,
    };
  }
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
      .addCase(fetchSeekers.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch seekers";
      });
  },
});

export default seekerSlice.reducer;
