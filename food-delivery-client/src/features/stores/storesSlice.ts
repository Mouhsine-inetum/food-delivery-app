import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StateStatus } from "../../interfaces/state";
import { Store } from "../../interfaces/store";
import { RootState } from "../../app/store";
import storesService from "./storesService";

interface StoresState {
  stores: Store[];
  status: StateStatus;
  message: string;
}

const initialState: StoresState = {
  stores: [],
  status: StateStatus.None,
  message: "",
};

export const getStores = createAsyncThunk(
  "stores/get-stores",
  async (_, thunkAPI) => {
    try {
      return await storesService.getStores();
    } catch (error: unknown) {
      let message: string = "";
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = StateStatus.None;
      state.message = "";
    },
    clear: (state) => {
      state.stores = [];
      state.status = StateStatus.None;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStores.pending, (state) => {
        state.status = StateStatus.Loading;
      })
      .addCase(getStores.rejected, (state, action) => {
        state.status = StateStatus.Error;
        state.message = action.payload as string;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.status = StateStatus.Success;
        state.stores = action.payload;
        console.log(state.stores);
      });
  },
});

export const storesSelector = (state: RootState) => state.stores;
export const { reset, clear } = storesSlice.actions;
export default storesSlice.reducer;
