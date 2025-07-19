import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";


const defaultProduct: Product = {
  id: "",
  name: "",
  description: "",
  price: "",
  stock: 0,
  image: "",
  isActive: false,
  createdAt: "",
  updatedAt: "",
};
export const productSlice = createSlice({
  name: "product",
  initialState: getLocalStorage("product") || { product: defaultProduct },
  reducers: {
    setProduct: (state, action) => {
      setLocalStorage("product", state);
      return action.payload;
    },
  },
});

export const { setProduct } = productSlice.actions;
