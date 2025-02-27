import { createContext, useContext } from "react";

import type { Cart } from "@/models/cart.model";
import { Product } from "@/models/product.model";

export const CartContext = createContext<{
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  changeItemQuantity: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: Product["id"]) => Promise<void>;
  clearCart: () => Promise<void>;
} | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error("useCart must be used within a CartProvider");

  return context;
};
