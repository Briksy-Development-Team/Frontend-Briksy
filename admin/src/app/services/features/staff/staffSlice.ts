import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchStaff as fetchStaffApi, SuperAdminListResponse, ApiFilterValue } from "../../api/superAdminApi";

type Staff = {
  id: number;
  name: string;
  email: string;
  status?: string;
  organization?: { id?: string; name?: string };
  created_at?: string;
  updated_at?: string;
};

type StaffQuery = {
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  page?: number;
  per_page?: number;
  filter?: Record<string, ApiFilterValue>;
};

type PaginationState = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number;
  to?: number;
  has_more_pages: boolean;
};

type StaffState = {
  data: Staff[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState | null;
  query: StaffQuery;
};

export const fetchStaff = createAsyncThunk<
  SuperAdminListResponse<Staff>,
  StaffQuery | undefined
>(
  "staff/fetch",
  async (query: StaffQuery | undefined = {}) => {
    const response = await fetchStaffApi<Staff>(query);
    return response;
  }
);

const initialState: StaffState = {
  data: [],
  loading: false,
  error: null,
  pagination: null,
  query: { page: 1, per_page: 10, direction: "desc" },
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaffQuery(state, action: PayloadAction<StaffQuery>) {
      state.query = { ...state.query, ...action.payload };
    },
    resetStaffError(state) {
      state.error = null;
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
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error fetching staff";
      });
  },
});

export const { setStaffQuery, resetStaffError } = staffSlice.actions;

export default staffSlice.reducer;
