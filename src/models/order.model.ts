import { User } from "./user.model";
import { z } from "zod";

export interface OrderDetails {
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  city: string;
  country: string;
  region: string;
  zip: string;
  phone: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  title: string;
  price: number;
  imgSrc: string;
}

export interface Order {
  id: number;
  userId: User["id"];
  items: OrderItem[];
  totalAmount: number;
  details: OrderDetails;
  createdAt: Date;
}

export const orderSchema = z.object({
  email: z.string().email("❌ Email inválido").min(1, "❌ El email es obligatorio")
});

export type orderFormData = z.infer<typeof orderSchema>;