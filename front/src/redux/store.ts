import { configureStore } from "@reduxjs/toolkit";
import type { Product } from "../types/product";
import { productSlice } from "./states/product";
import { cardInformationSlice } from "./states/cardInformation";
import { deliveryInformationSlice } from "./states/deliveryInformation";
import type { ICardInformation } from "../types/cardInformation";
import type { IDeliveryInformation } from "../types/deliveryInformation";

export interface IAppStore {
  product: Product & { quantity: number };
  cardInformation: ICardInformation;
  deliveryInformation: IDeliveryInformation;
}

export default configureStore({
  reducer: {
    product: productSlice.reducer,
    cardInformation: cardInformationSlice.reducer,
    deliveryInformation: deliveryInformationSlice.reducer,
  },
});
