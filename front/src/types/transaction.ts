/**
 * 
{
  "id": "8ca4004c-73c5-427c-b599-10dc3bb8426c",
  "externalId": "txn_1234567890",
  "reference": "REF_GM_1753050658303",
  "status": "pending",
  "totalAmount": "0.00",
  "customer": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jimmy Page",
    "email": "jimmy.page@example.com",
    "phone": "3012909829",
    "address": "Calle 123 #45-67, Medellín, Colombia",
    "createdAt": "2025-07-21T05:37:13.328Z",
    "updatedAt": "2025-07-21T05:37:13.328Z"
  },
  "transactionProducts": [
    {
      "id": "d1408e60-4421-42b1-8531-24f73c66e5c2",
      "product": {
        "id": "97650250-41e4-4328-b531-e7984d1a0c1e",
        "name": "Ibanez RG550",
        "description": "Guitarra eléctrica Ibanez RG550 Genesis Collection, color Desert Sun Yellow",
        "price": "2000000.00",
        "stock": 58,
        "image": "https://images.unsplash.com/photo-1556449895-a33c9dba33dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "isActive": true,
        "createdAt": "2025-07-21T05:37:13.324Z",
        "updatedAt": "2025-07-21T06:35:57.366Z"
      },
      "quantity": 2,
      "priceAtTime": "2000000.00",
      "createdAt": "2025-07-21T05:38:25.266Z"
    }
  ],
  "createdAt": "2025-07-21T05:38:25.252Z",
  "updatedAt": "2025-07-21T05:38:25.252Z"
}

   */
interface TransactionProduct {
  productId?: string;
  quantity: number;
}
export interface TransactionResponse {
  id?: string;
  externalId: string | null;
  reference: string | null;
  status: string;
  totalAmount: number;
  customer: string;
  transactionProducts?: TransactionProduct[];
  products?: TransactionProduct[];
}