import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  fetchServiceGroupApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
  type GetServiceListParams,
} from "./service_list.api";

import { mapServiceList } from "./service_list.mapper";

import type { ServiceList, ServiceFormValues } from "./service_list.types";

type ServiceState = {
  data: ServiceList[];
  total: number;

  loading: boolean;
  saving: boolean;

  error: string | null;

  isModalOpen: boolean;
  editingService: ServiceList | null;

  deleteModalOpen: boolean;
  deletingService: ServiceList | null;
};

const initialState: ServiceState = {
  data: [],
  total: 0,

  loading: false,
  saving: false,

  error: null,

  isModalOpen: false,
  editingService: null,

  deleteModalOpen: false,
  deletingService: null,
};

export const fetchServiceList = createAsyncThunk(
  "services/fetch",
  async (params: GetServiceListParams) => {
    const res = await fetchServiceGroupApi(params);

    return {
      data: res.data.map(mapServiceList),
      total: res.total,
    };
  },
);

export const saveService = createAsyncThunk(
  "services/save",
  async (payload: { id?: string; values: ServiceFormValues }) => {
    if (payload.id) {
      return await updateServiceApi(payload.id, payload.values);
    }

    return await createServiceApi(payload.values);
  },
);

export const deleteService = createAsyncThunk(
  "services/delete",
  async (id: string) => {
    await deleteServiceApi(id);

    return id;
  },
);

const serviceSlice = createSlice({
  name: "services",

  initialState,

  reducers: {
    openServiceModal(state, action: PayloadAction<ServiceList | null>) {
      state.isModalOpen = true;
      state.editingService = action.payload;
    },

    closeServiceModal(state) {
      state.isModalOpen = false;
      state.editingService = null;
    },

    openDeleteServiceModal(state, action: PayloadAction<ServiceList>) {
      state.deleteModalOpen = true;
      state.deletingService = action.payload;
    },

    closeDeleteServiceModal(state) {
      state.deleteModalOpen = false;
      state.deletingService = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchServiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchServiceList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })

      .addCase(fetchServiceList.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message ?? "Failed to fetch services";
      })

      .addCase(saveService.pending, (state) => {
        state.saving = true;
      })

      .addCase(saveService.fulfilled, (state) => {
        state.saving = false;

        state.isModalOpen = false;
        state.editingService = null;
      })

      .addCase(saveService.rejected, (state) => {
        state.saving = false;
      })

      .addCase(deleteService.pending, (state) => {
        state.saving = true;
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.saving = false;

        state.deleteModalOpen = false;
        state.deletingService = null;

        state.data = state.data.filter((item) => item.id !== action.payload);
      })

      .addCase(deleteService.rejected, (state) => {
        state.saving = false;
      });
  },
});

export const {
  openServiceModal,
  closeServiceModal,
  openDeleteServiceModal,
  closeDeleteServiceModal,
} = serviceSlice.actions;

export default serviceSlice.reducer;
