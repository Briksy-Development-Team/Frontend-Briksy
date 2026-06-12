import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPropertyListApi, type PropertyListParams } from "./property.api";
import { mapPropertyGroup } from "./property.mapper";
import type { PropertyList } from "./property.types";

type ServiceGroupState = {
  data: PropertyList[];
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

export const fetchPropertyList = createAsyncThunk(
  "propertylist/fetch",
  async (params: PropertyListParams) => {
    const res = await fetchPropertyListApi(params);

    if (!res.data) throw new Error("Invalid API response");

    return {
      data: res.data.map(mapPropertyGroup),
      total: res.total,
    };
  },
);

const PropertyListSlice = createSlice({
  name: "propertyGroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchPropertyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch property listings";
      });
  },
});

export default PropertyListSlice.reducer;
