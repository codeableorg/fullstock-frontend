import type { Cart } from "@/models/cart.model";
import { Product } from "@/models/product.model";
import { createContext, useContext } from "react";

export const CartContext = createContext<{
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: Product["id"]) => Promise<void>;
  updateQuantity: (productId: Product["id"], quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
} | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error("useCart must be used within a CartProvider");

  return context;
};
