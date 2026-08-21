import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  fetchStaffApi,
  createStaffApi,
  updateStaffApi,
  deleteStaffApi,
} from "./staff.api";

import { mapStaff } from "./staff.mapper";

import type { Staff, StaffFormValues, GetStaffParams } from "./staff.types";

type StaffState = {
  data: Staff[];
  total: number;
  loading: boolean;
  error: string | null;

  isModalOpen: boolean;
  editingStaff: Staff | null;

  deleteModalOpen: boolean;
  deletingStaff: Staff | null;

  saving: boolean;
};

const initialState: StaffState = {
  data: [],
  total: 0,
  loading: false,
  error: null,

  isModalOpen: false,
  editingStaff: null,

  deleteModalOpen: false,
  deletingStaff: null,

  saving: false,
};

export const fetchStaff = createAsyncThunk(
  "staff/fetch",
  async (params: GetStaffParams) => {
    const res = await fetchStaffApi(params);

    return {
      data: res.data.map(mapStaff),
      total: res.total,
    };
  },
);

export const saveStaff = createAsyncThunk(
  "staff/save",
  async (payload: { id?: string; values: StaffFormValues }) => {
    if (payload.id) {
      await updateStaffApi(payload.id, payload.values);
    } else {
      await createStaffApi(payload.values);
    }
  },
);

export const deleteStaff = createAsyncThunk(
  "staff/delete",
  async (id: string) => {
    await deleteStaffApi(id);
    return id;
  },
);

const staffSlice = createSlice({
  name: "staff",

  initialState,

  reducers: {
    openStaffModal(state, action: PayloadAction<Staff | null>) {
      state.isModalOpen = true;
      state.editingStaff = action.payload;
    },

    closeStaffModal(state) {
      state.isModalOpen = false;
      state.editingStaff = null;
    },

    openDeleteStaffModal(state, action: PayloadAction<Staff>) {
      state.deleteModalOpen = true;
      state.deletingStaff = action.payload;
    },

    closeDeleteStaffModal(state) {
      state.deleteModalOpen = false;
      state.deletingStaff = null;
    },
  },

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
        state.error = action.error.message ?? "Failed to fetch staff";
      })

      .addCase(saveStaff.pending, (state) => {
        state.saving = true;
      })

      .addCase(saveStaff.fulfilled, (state) => {
        state.saving = false;
        state.isModalOpen = false;
        state.editingStaff = null;
      })

      .addCase(saveStaff.rejected, (state) => {
        state.saving = false;
      })

      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.data = state.data.filter((staff) => staff.id !== action.payload);

        state.deleteModalOpen = false;
        state.deletingStaff = null;
      });
  },
});

export const {
  openStaffModal,
  closeStaffModal,
  openDeleteStaffModal,
  closeDeleteStaffModal,
} = staffSlice.actions;

export default staffSlice.reducer;
