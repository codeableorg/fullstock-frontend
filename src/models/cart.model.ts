import { type Product } from "./product.model";
import { type User } from "./user.model";

export interface CartItem {
  id: number;
  product: Pick<
    Product,
    "id" | "title" | "imgSrc" | "alt" | "price" | "isOnSale"
  >;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  userId: User["id"] | null;
  sessionCartId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItemInput {
  productId: Product["id"];
  quantity: number;
  title: Product["title"];
  price: Product["price"];
  imgSrc: Product["imgSrc"];
}
