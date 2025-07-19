import { createSlice } from "@reduxjs/toolkit";
import type { IDeliveryInformation } from "../../types/deliveryInformation";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";

export const defaultDeliveryInformation: IDeliveryInformation = {
  fullName: "",
  email: "",
  address: "",
  city: "",
};
export const deliveryInformationSlice = createSlice({
  name: "deliveryInformation",
  initialState: getLocalStorage("deliveryInformation")
    ? getLocalStorage("deliveryInformation")
    : defaultDeliveryInformation,
  reducers: {
    setDeliveryInformation: (state, action) => {
      setLocalStorage("deliveryInformation", state);
      return action.payload;
    },
  },
});

export const { setDeliveryInformation } = deliveryInformationSlice.actions;
