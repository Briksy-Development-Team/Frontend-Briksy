import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSeekersApi } from "./seekerApi";

export const fetchSeekers = createAsyncThunk(
  "seeker/fetch",
  async () => {
    return await fetchSeekersApi();
  }
);

const seekerSlice = createSlice({
  name: "seeker",
  initialState: {
    data: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeekers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSeekers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload as any;
      })
      .addCase(fetchSeekers.rejected, (state) => {
        state.loading = false;
        state.error = "Error fetching seekers";
      });
  },
});

export default seekerSlice.reducer;