import type { CartItem } from "@/models/cart.model";
import { Product } from "@/models/product.model";
import { createContext, useContext } from "react";

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

export const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: Product["id"]) => Promise<void>;
  updateQuantity: (productId: Product["id"], quantity: number) => Promise<void>;
} | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error("useCart must be used within a CartProvider");

  return context;
};
