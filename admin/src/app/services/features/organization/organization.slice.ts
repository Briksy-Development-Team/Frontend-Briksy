import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrganizationApi } from "./organization.api";
import { mapOrganization } from "./organization.mapper";
import type { Organization, GetOrganizationParams } from "./organization.types";

type OrganizationState = {
  data: Organization[];
  total: number;
  loading: boolean;
  listRequestId?: string;
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
      data: res.data.map(mapOrganization),
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
      .addCase(fetchOrganization.pending, (state, action) => {
        state.listRequestId = action.meta.requestId;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganization.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.listRequestId = undefined;
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchOrganization.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.listRequestId = undefined;
        state.loading = false;
        state.error = action.error.message || "Failed to fetch organization";
      });
  },
});

export default OrganizationSlice.reducer;
