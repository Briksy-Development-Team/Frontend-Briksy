import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { fetchStaffApi, createStaffApi, updateStaffApi } from "./staff.api";
import { mapStaff } from "./staff.mapper";
import type {
  StaffMember,
  StaffFormValues,
  GetStaffParams,
} from "./staff.types";

type StaffState = {
  data: StaffMember[];
  total: number;
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingStaff: StaffMember | null;
  saving: boolean;
};

const initialState: StaffState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
  isModalOpen: false,
  editingStaff: null,
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

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    openStaffModal(state, action: PayloadAction<StaffMember | null>) {
      state.isModalOpen = true;
      state.editingStaff = action.payload;
    },
    closeStaffModal(state) {
      state.isModalOpen = false;
      state.editingStaff = null;
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
      });
  },
});

export const { openStaffModal, closeStaffModal } = staffSlice.actions;
export default staffSlice.reducer;
