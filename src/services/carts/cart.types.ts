import { type Product } from "../products/product.types";

export interface CartItem {
  product: Product;
  quantity: number;
}
