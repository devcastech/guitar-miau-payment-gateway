export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  count: number;
}
export interface ProductResponse {
  data: Product;
}