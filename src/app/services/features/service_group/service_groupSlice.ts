import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchServiceGroupApi,
  type GetServiceGroupParams,
} from "./service_groupApi";
import { mapServiceGroup } from "./service_groupMapper";
import type { ServiceGroup } from "./service_group.types";

type ServiceGroupState = {
  data: ServiceGroup[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: ServiceGroupState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchServiceGroup = createAsyncThunk(
  "servicegroup/fetch",
  async (params: GetServiceGroupParams) => {
    const res = await fetchServiceGroupApi(params);

    if (!res.data) throw new Error("Invalid API response");

    return {
      data: res.data.map(mapServiceGroup),
      total: res.total,
    };
  },
);

const ServiceGroupSlice = createSlice({
  name: "serviceGroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchServiceGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch service groups";
      });
  },
});

export default ServiceGroupSlice.reducer;
