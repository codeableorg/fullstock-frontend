import { CartItem } from "@/models/cart.model";

export interface OrderDetails {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  city: string;
  country: string;
  region: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  details: OrderDetails;
  createdAt: Date;
}
