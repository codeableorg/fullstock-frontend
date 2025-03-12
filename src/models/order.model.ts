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
