import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastVariant = "success" | "info";

export interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
}

const initialState = null as ToastState | null;

let nextId = 1;

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (
      _state,
      action: PayloadAction<{ message: string; variant?: ToastVariant }>
    ) => {
      return {
        id: nextId++,
        message: action.payload.message,
        variant: action.payload.variant ?? "success",
      };
    },
    clearToast: () => null,
  },
});

export const { showToast, clearToast } = toastSlice.actions;

export default toastSlice.reducer;
