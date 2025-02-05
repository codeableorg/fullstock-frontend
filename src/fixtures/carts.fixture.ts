import { products } from "@/fixtures/products.fixture";
import type { Cart, CartItem } from "@/models/cart.model";
import { calculateTotal } from "@/services/cart.service";

import { users } from "./users.fixture";


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
