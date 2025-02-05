import type { Cart, CartItem } from "@/models/cart.model";
import { products } from "@/fixtures/products.fixture";
import { users } from "./users.fixture";
import { calculateTotal } from "@/services/cart.service";

const items: CartItem[] = [
  { product: products[0], quantity: 1 },
  { product: products[1], quantity: 2 },
];

export const carts: Cart[] = [
  {
    id: "c1",
    userId: users[0].id,
    items,
    total: calculateTotal(items),
  },
];
