import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import { PAYMENT_STEPS } from "../../utils/constants";

export const defaultApp = {
  paymentModal: {
    open: false,
    step: PAYMENT_STEPS.STEP_1.id,
  },
};

const getInitialState = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get("id");

  if (transactionId) {
    return {
      paymentModal: {
        open: true,
        step: PAYMENT_STEPS.STEP_3.id,
      },
    };
  }

  return getLocalStorage("app") ? getLocalStorage("app") : defaultApp;
};

export const appSlice = createSlice({
  name: "app",
  initialState: getInitialState(),
  reducers: {
    setPaymentModal: (state, action) => {
      setLocalStorage("app", { ...state, paymentModal: action.payload });
      state.paymentModal = action.payload;
    },
  },
});

export const { setPaymentModal } = appSlice.actions;
