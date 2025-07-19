import { createSlice } from "@reduxjs/toolkit";
import type { ICardInformation } from "../../types/cardInformation";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";


export const defaultCardInformation: ICardInformation = {
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardHolder: "",
};
export const cardInformationSlice = createSlice({
  name: "cardInformation",
  initialState: getLocalStorage("cardInformation")
    ? getLocalStorage("cardInformation")
    : defaultCardInformation,
  reducers: {
    setCardInformation: (state, action) => {
      setLocalStorage("cardInformation", state);
      return action.payload;
    },
  },
});

export const { setCardInformation } = cardInformationSlice.actions;
