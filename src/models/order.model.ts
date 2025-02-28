import { CartItem } from "@/models/cart.model";
import { User } from "./user.model";

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

export interface Order {
  id: string;
  userId: User["id"];
  items: CartItem[];
  details: OrderDetails;
  createdAt: Date;
}
