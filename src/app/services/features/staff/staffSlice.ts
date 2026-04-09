import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStaffApi, type GetStaffParams } from "./staffApi";
import { mapStaff } from "./staffMapper";
import type { Staff } from "./staff.types";

type StaffState = {
  data: Staff[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: StaffState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchStaff = createAsyncThunk(
  "staff/fetch",
  async (params: GetStaffParams) => {
    const res = await fetchStaffApi(params);

    console.log("API RAW RESPONSE:", res);

    return {
      data: res.data.map(mapStaff),
      total: res.total,
    };
  },
);

const ServiceSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch service";
      });
  },
});

export default ServiceSlice.reducer;
