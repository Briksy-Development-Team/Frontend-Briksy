import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrganizations as fetchOrganizationsApi, SuperAdminListResponse, ApiFilterValue } from "../../api/superAdminApi";

type Organization = {
  id: number;
  name: string;
  email?: string;
  status?: string;
  type?: string;
  organization_type?: { id?: string; name?: string; slug?: string };
  created_at?: string;
  updated_at?: string;
};

type OrganizationQuery = {
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

type OrganizationState = {
  data: Organization[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState | null;
  query: OrganizationQuery;
};

export const fetchOrganizations = createAsyncThunk<
  SuperAdminListResponse<Organization>,
  OrganizationQuery | undefined
>(
  "organization/fetch",
  async (query: OrganizationQuery | undefined = {}) => {
    const response = await fetchOrganizationsApi<Organization>(query);
    return response;
  }
);

const initialState: OrganizationState = {
  data: [],
  loading: false,
  error: null,
  pagination: null,
  query: { page: 1, per_page: 10, direction: "desc" },
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizationQuery(state, action: PayloadAction<OrganizationQuery>) {
      state.query = { ...state.query, ...action.payload };
    },
    resetOrganizationError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error fetching organizations";
      });
  },
});

export const { setOrganizationQuery, resetOrganizationError } = organizationSlice.actions;

export default organizationSlice.reducer;
