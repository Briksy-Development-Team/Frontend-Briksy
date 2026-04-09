import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrganizationApi, type GetOrganizationParams } from "./orgrApi";
import { mapSeeker } from "./orgrMapper";
import type { Organization } from "./orgr.types";

type OrganizationState = {
  data: Organization[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: OrganizationState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchOrganization = createAsyncThunk(
  "organization/fetch",
  async (params: GetOrganizationParams) => {
    const res = await fetchOrganizationApi(params);

    console.log("API RAW RESPONSE:", res);

    return {
      data: res.data.map(mapSeeker),
      total: res.total,
    };
  },
);

const OrganizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch organization";
      });
  },
});

export default OrganizationSlice.reducer;
