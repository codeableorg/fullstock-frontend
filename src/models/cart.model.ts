import { type Product } from "./product.model";
import { type User } from "./user.model";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  userId?: User["id"];
  items: CartItem[];
  total: number;
}

export interface CartItemInput {
  productId: Product["id"];
  quantity: number;
  title: Product["title"];
  price: Product["price"];
  imgSrc: Product["imgSrc"];
}
