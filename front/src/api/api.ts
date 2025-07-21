import axios from "axios"
import { API_URL } from "../utils/constants"
import { type ProductsResponse, type ProductResponse } from "../types/product";
import type { TransactionResponse } from "../types/transaction";

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
export const createTransaction = async (
  transaction: TransactionResponse
): Promise<TransactionResponse | null> => {
  const url = `${API_URL}/transactions/${transaction.id}`;

  try {
    const responseGet = await axios.get<TransactionResponse>(url);
    console.log("Transaction exists:", responseGet.data);
    return responseGet.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log("Transaction not found, creating a new one");
      try {
        const responseCreate = await axios.post<TransactionResponse>(
          `${API_URL}/transactions`,
          transaction
        );
        console.log("Transaction created:", responseCreate.data);
        return responseCreate.data;
      } catch (createError) {
        console.error("Error creating transaction:", createError);
        throw createError;
      }
    }
    console.error("Error checking transaction:", error);
    throw error;
  }
};

export const getTransaction = async (id: string) => {
  try {
    const url = `${API_URL}/transactions/${id}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }

}