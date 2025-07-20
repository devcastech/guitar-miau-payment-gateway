import { configureStore } from "@reduxjs/toolkit";
import { productSlice } from "./states/product";
import { cardInformationSlice } from "./states/cardInformation";
import { deliveryInformationSlice } from "./states/deliveryInformation";
import type { Product } from "../types/product";
import type { ICardInformation } from "../types/cardInformation";
import type { IDeliveryInformation } from "../types/deliveryInformation";
import type { IApp } from "../types/app";
import { appSlice } from "./states/app";

export interface IAppStore {
  product: Product & { quantity: number };
  cardInformation: ICardInformation;
  deliveryInformation: IDeliveryInformation;
  app: IApp;
}

export default configureStore({
  reducer: {
    product: productSlice.reducer,
    cardInformation: cardInformationSlice.reducer,
    deliveryInformation: deliveryInformationSlice.reducer,
    app: appSlice.reducer,
  },
});
