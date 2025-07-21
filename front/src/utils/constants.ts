export const API_URL = import.meta.env.VITE_API_URL;
export const PAYMENT_PUBLIC_KEY=  import.meta.env.VITE_PAYMENT_PUBLIC_KEY;
export const PAYMENT_INTEGRITY_KEY = import.meta.env.VITE_PAYMENT_INTEGRITY_KEY;
export const CUSTOMER_ID = "550e8400-e29b-41d4-a716-446655440000";
export const PAYMENT_STEPS = {
  STEP_1: {
    id: 1,
    value: "cardAndDeliveryInformation",
  },
  STEP_2: {
    id: 2,
    value: "summary",
  },
  STEP_3: {
    id: 3,
    value: "finalStatus",
  },
};