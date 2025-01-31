import type { CartItem } from "@/models/cart.model";
import { User } from "@/models/user.model";
import { products } from "@/fixtures/products.fixture";

export const carts = new Map<User["id"], CartItem[]>();

carts.set("1", [
  { product: products[0], quantity: 1 },
  { product: products[1], quantity: 2 },
]);
