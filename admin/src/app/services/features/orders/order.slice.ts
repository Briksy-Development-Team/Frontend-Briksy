import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  fetchOrdersApi,
  createOrderApi,
  updateOrderApi,
  deleteOrderApi,
  cancelOrderApi,
  markOrderPaidApi,
} from "./order.api";

import { mapOrder } from "./order.Mapper";

import type { Order, OrderFormValues, GetOrderParams } from "./order.types";

type OrderState = {
  data: Order[];
  total: number;
  loading: boolean;
  error: string | null;

  isModalOpen: boolean;
  editingOrder: Order | null;
  deleteModalOpen: boolean;
  deletingOrder: Order | null;
  saving: boolean;
};

const initialState: OrderState = {
  data: [],
  total: 0,
  loading: false,
  error: null,

  isModalOpen: false,
  editingOrder: null,
  deleteModalOpen: false,
  deletingOrder: null,
  saving: false,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async (params: GetOrderParams) => {
    const res = await fetchOrdersApi(params);

    return {
      data: res.data.map(mapOrder),
      total: res.total,
    };
  },
);

export const saveOrder = createAsyncThunk(
  "orders/save",
  async (payload: { id?: string; values: OrderFormValues }) => {
    if (payload.id) {
      await updateOrderApi(payload.id, payload.values);
    } else {
      await createOrderApi(payload.values);
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id: string) => {
    await deleteOrderApi(id);
    return id;
  },
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (id: string) => {
    await cancelOrderApi(id);
    return id;
  },
);

export const markOrderPaid = createAsyncThunk(
  "orders/markPaid",
  async (id: string) => {
    await markOrderPaidApi(id);
    return id;
  },
);

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    openOrderModal(state, action: PayloadAction<Order | null>) {
      state.isModalOpen = true;
      state.editingOrder = action.payload;
    },

    closeOrderModal(state) {
      state.isModalOpen = false;
      state.editingOrder = null;
    },

    openDeleteOrderModal(state, action: PayloadAction<Order>) {
      state.deleteModalOpen = true;
      state.deletingOrder = action.payload;
    },

    closeDeleteOrderModal(state) {
      state.deleteModalOpen = false;
      state.deletingOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch orders";
      })

      .addCase(saveOrder.pending, (state) => {
        state.saving = true;
      })

      .addCase(saveOrder.fulfilled, (state) => {
        state.saving = false;
        state.isModalOpen = false;
        state.editingOrder = null;
      })

      .addCase(saveOrder.rejected, (state) => {
        state.saving = false;
      })

      .addCase(cancelOrder.fulfilled, (state) => {
        state.isModalOpen = false;
      })

      .addCase(markOrderPaid.fulfilled, (state) => {
        state.isModalOpen = false;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);

        state.deleteModalOpen = false;
        state.deletingOrder = null;
      });
  },
});

export const {
  openOrderModal,
  closeOrderModal,
  openDeleteOrderModal,
  closeDeleteOrderModal,
} = orderSlice.actions;

export default orderSlice.reducer;
