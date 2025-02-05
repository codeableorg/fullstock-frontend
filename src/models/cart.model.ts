import { type Product } from "./product.model";
import { type User } from "./user.model";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId?: User["id"];
  items: CartItem[];
  total: number;
}
