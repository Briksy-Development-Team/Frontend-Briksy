import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  fetchPropertyListApi,
  createPropertyApi,
  updatePropertyApi,
  deletePropertyApi,
} from "./property.api";

import { mapPropertyGroup } from "./property.mapper";

import type {
  Property,
  PropertyList,
  PropertyFormValues,
  PropertyListParams,
} from "./property.types";

type PropertyState = {
  data: PropertyList[];
  total: number;

  loading: boolean;
  saving: boolean;

  error: string | null;

  isModalOpen: boolean;
  editingProperty: Property | null;
  deleteModalOpen: boolean;
  deletingProperty: Property | null;
};

const initialState: PropertyState = {
  data: [],
  total: 0,

  loading: false,
  saving: false,

  error: null,

  isModalOpen: false,
  editingProperty: null,

  deleteModalOpen: false,
  deletingProperty: null,
};

export const fetchPropertyList = createAsyncThunk(
  "properties/fetch",
  async (params: PropertyListParams) => {
    const res = await fetchPropertyListApi(params);

    return {
      data: res.data.map(mapPropertyGroup),
      total: res.total,
    };
  },
);

export const saveProperty = createAsyncThunk(
  "properties/save",
  async (payload: { id?: string; values: PropertyFormValues }) => {
    if (payload.id) {
      return await updatePropertyApi(payload.id, payload.values);
    }

    return await createPropertyApi(payload.values);
  },
);

export const deleteProperty = createAsyncThunk(
  "properties/delete",
  async (id: string) => {
    await deletePropertyApi(id);

    return id;
  },
);

const propertySlice = createSlice({
  name: "properties",

  initialState,

  reducers: {
    openPropertyModal(state, action: PayloadAction<Property | null>) {
      state.isModalOpen = true;
      state.editingProperty = action.payload;
    },

    closePropertyModal(state) {
      state.isModalOpen = false;
      state.editingProperty = null;
    },

    openDeletePropertyModal(state, action: PayloadAction<Property>) {
      state.deleteModalOpen = true;
      state.deletingProperty = action.payload;
    },

    closeDeletePropertyModal(state) {
      state.deleteModalOpen = false;
      state.deletingProperty = null;
    },
  },

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

        state.error = action.error.message ?? "Failed to fetch properties";
      })

      .addCase(saveProperty.pending, (state) => {
        state.saving = true;
      })

      .addCase(saveProperty.fulfilled, (state) => {
        state.saving = false;

        state.isModalOpen = false;
        state.editingProperty = null;
      })

      .addCase(saveProperty.rejected, (state) => {
        state.saving = false;
      })

      .addCase(deleteProperty.pending, (state) => {
        state.saving = true;
      })

      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.saving = false;

        state.deleteModalOpen = false;
        state.deletingProperty = null;

        state.data = state.data.filter((item) => item.id !== action.payload);
      })

      .addCase(deleteProperty.rejected, (state) => {
        state.saving = false;
      });
  },
});

export const {
  openPropertyModal,
  closePropertyModal,
  openDeletePropertyModal,
  closeDeletePropertyModal,
} = propertySlice.actions;

export default propertySlice.reducer;
