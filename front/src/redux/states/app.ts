import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import { PAYMENT_STEPS } from "../../utils/constants";

export const defaultApp = {
  paymentModal: {
    open: false,
    step: PAYMENT_STEPS.STEP_2.id,
  },
};
export const appSlice = createSlice({
  name: "app",
  initialState: getLocalStorage("app") ? getLocalStorage("app") : defaultApp,
  reducers: {
    setPaymentModal: (state, action) => {
      setLocalStorage("app", { ...state, paymentModal: action.payload });
      state.paymentModal = action.payload;
    },
  },
});

export const { setPaymentModal } = appSlice.actions;