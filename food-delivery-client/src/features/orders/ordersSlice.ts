import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StateStatus, OrderStatus } from "../../interfaces/enums";
import { RootState } from "../../app/store";
import { OrderRequestDto, OrderState } from "../../interfaces/order";
import ordersService from "./ordersService";

interface OrdersState {
  orders: OrderState[];
  status: StateStatus;
  message: string;
}

const initialState: OrdersState = {
  orders: [],
  status: StateStatus.None,
  message: "",
};

export const getOrders = createAsyncThunk("orders/get", async (_, thunkAPI) => {
  try {
    const { accessToken } = (thunkAPI.getState() as RootState).auth;
    return await ordersService.getOrders(accessToken!.payload);
  } catch (error: unknown) {
    let message: string = "";
    if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const createCheckout = createAsyncThunk(
  "orders/checkout",
  async (orderData: OrderRequestDto, thunkAPI) => {
    try {
      const { accessToken } = (thunkAPI.getState() as RootState).auth;
      return await ordersService.createCheckout(
        orderData,
        accessToken!.payload
      );
    } catch (error: unknown) {
      let message: string = "";
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData: OrderRequestDto, thunkAPI) => {
    try {
      const { accessToken } = (thunkAPI.getState() as RootState).auth;
      return await ordersService.createOrder(orderData, accessToken!.payload);
    } catch (error: unknown) {
      let message: string = "";
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (orderId: number, thunkAPI) => {
    try {
      const { accessToken } = (thunkAPI.getState() as RootState).auth;
      return await ordersService.cancelOrder(orderId, accessToken!.payload);
    } catch (error: unknown) {
      let message: string = "";
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = StateStatus.None;
      state.message = "";
    },
    clearOrders: (state) => {
      state.orders = [];
      state.status = StateStatus.None;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = StateStatus.Loading;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.status = StateStatus.Error;
        state.message = action.payload as string;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = StateStatus.Success;
        state.orders = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.status = StateStatus.Loading;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = StateStatus.Error;
        state.message = action.payload as string;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = StateStatus.Success;
        state.orders.push(action.payload);
      })
      .addCase(cancelOrder.pending, (state) => {
        state.status = StateStatus.Loading;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status = StateStatus.Error;
        state.message = action.payload as string;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.status = StateStatus.Success;
        state.orders = state.orders.map((order) => {
          if (order.id === action.payload.id) {
            return { ...order, orderStatus: OrderStatus.Canceled };
          }

          return order;
        });
      });
  },
});

export const ordersSelector = (state: RootState) => state.orders;
export const { reset, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
