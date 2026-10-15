import axios from "axios";

const PAYSTACK_BASE = "https://api.paystack.co";
const SECRET = process.env.PAYSTACK_SECRET_KEY as string;

const client = axios.create({
  baseURL: PAYSTACK_BASE,
  headers: {
    Authorization: `Bearer ${SECRET}`,
    "Content-Type": "application/json",
  },
});

export interface InitPaymentPayload {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

export async function initializePayment(payload: InitPaymentPayload) {
  const res = await client.post("/transaction/initialize", payload);
  return res.data;
}

export async function verifyPayment(reference: string) {
  const res = await client.get(`/transaction/verify/${reference}`);
  return res.data;
}

export default client;
