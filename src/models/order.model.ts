import type {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from "generated/prisma/client";

export type OrderDetails = Pick<
  PrismaOrder,
  | "email"
  | "firstName"
  | "lastName"
  | "company"
  | "address"
  | "city"
  | "country"
  | "region"
  | "zip"
  | "phone"
>;

export type OrderItem = Omit<PrismaOrderItem, "price"> & {
  price: number;
};

export type Order = Omit<PrismaOrder, "totalAmount"> & {
  items: OrderItem[];
  totalAmount: number;
  details: OrderDetails;
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
};

export interface OrderItemInput {
  productId: number;
  quantity: number;
  title: string;
  price: number;
  imgSrc: string;
}

export interface OrderResponse {
  id: number;
}
