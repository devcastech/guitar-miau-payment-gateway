import axios from "axios"
import { API_URL } from "../utils/constants"
import { type ProductsResponse, type Product, type ProductResponse } from "../types/product";

export const getProducts = async (): Promise<ProductsResponse | null> => {
  try {
    const url = `${API_URL}/products`;
    const response = await axios.get<ProductsResponse>(url);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getProduct = async (
  id: string,
): Promise<ProductResponse | null> => {
  try {
    const url = `${API_URL}/products/${id}`;
    const response = await axios.get<ProductResponse>(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};