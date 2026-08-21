import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  fetchCouponsApi,
  createCouponApi,
  updateCouponApi,
  deleteCouponApi,
  activateCouponApi,
  deactivateCouponApi,
  validateCouponApi,
} from "./coupon.api";

import { mapCoupon } from "./coupon.mapper";

import type {
  Coupon,
  CouponFormValues,
  CouponValidationValues,
} from "./coupon.types";

import type { GetCouponParams } from "./coupon.api";

type CouponState = {
  data: Coupon[];
  total: number;
  loading: boolean;
  error: string | null;

  isModalOpen: boolean;
  isValidationModalOpen: boolean;

  editingCoupon: Coupon | null;

  saving: boolean;
  deleteModalOpen: boolean;
  deletingCoupon: Coupon | null;
  validationResult: any | null;
};

const initialState: CouponState = {
  data: [],
  total: 0,
  loading: false,
  error: null,

  isModalOpen: false,
  isValidationModalOpen: false,
  deleteModalOpen: false,
  deletingCoupon: null,
  editingCoupon: null,

  saving: false,

  validationResult: null,
};

export const fetchCoupons = createAsyncThunk(
  "coupons/fetch",
  async (params: GetCouponParams) => {
    const res = await fetchCouponsApi(params);

    return {
      data: res.data.map(mapCoupon),
      total: res.total,
    };
  },
);

export const saveCoupon = createAsyncThunk(
  "coupons/save",
  async (payload: { id?: string; values: CouponFormValues }) => {
    if (payload.id) {
      await updateCouponApi(payload.id, payload.values);
    } else {
      await createCouponApi(payload.values);
    }
  },
);

export const deleteCoupon = createAsyncThunk(
  "coupons/delete",
  async (id: string) => {
    await deleteCouponApi(id);
    return id;
  },
);

export const activateCoupon = createAsyncThunk(
  "coupons/activate",
  async (id: string) => {
    return await activateCouponApi(id);
  },
);

export const deactivateCoupon = createAsyncThunk(
  "coupons/deactivate",
  async (id: string) => {
    return await deactivateCouponApi(id);
  },
);

export const validateCoupon = createAsyncThunk(
  "coupons/validate",
  async (payload: CouponValidationValues) => {
    return await validateCouponApi(payload);
  },
);

const couponSlice = createSlice({
  name: "coupons",

  initialState,

  reducers: {
    openCouponModal(state, action: PayloadAction<Coupon | null>) {
      state.isModalOpen = true;
      state.editingCoupon = action.payload;
    },

    closeCouponModal(state) {
      state.isModalOpen = false;
      state.editingCoupon = null;
    },

    openValidationModal(state) {
      state.isValidationModalOpen = true;
    },

    closeValidationModal(state) {
      state.isValidationModalOpen = false;
      state.validationResult = null;
    },

    openDeleteCouponModal(state, action: PayloadAction<Coupon>) {
      state.deleteModalOpen = true;
      state.deletingCoupon = action.payload;
    },

    closeDeleteCouponModal(state) {
      state.deleteModalOpen = false;
      state.deletingCoupon = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })

      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch coupons";
      })

      .addCase(saveCoupon.pending, (state) => {
        state.saving = true;
      })

      .addCase(saveCoupon.fulfilled, (state) => {
        state.saving = false;
        state.isModalOpen = false;
        state.editingCoupon = null;
      })

      .addCase(saveCoupon.rejected, (state) => {
        state.saving = false;
      })

      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.validationResult = action.payload;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);

        state.deleteModalOpen = false;
        state.deletingCoupon = null;
      });
  },
});

export const {
  openCouponModal,
  closeCouponModal,
  openValidationModal,
  closeValidationModal,
  openDeleteCouponModal,
  closeDeleteCouponModal,
} = couponSlice.actions;

export default couponSlice.reducer;
