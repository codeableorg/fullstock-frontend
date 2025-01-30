import { createContext, useContext, useEffect, useState } from "react";

import { type CartItem } from "@/services/carts/cart.types";
import { getCart, updateCart } from "@/services/carts/cart.service";
import { Product } from "@/services/products/product.types";

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: Product["id"]) => Promise<void>;
  updateQuantity: (productId: Product["id"], quantity: number) => Promise<void>;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const items = await getCart();
        setItems(items);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          setError("Failed to load cart");
        } else {
          throw error;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const addItem = async (product: Product) => {
    setLoading(true);
    try {
      const updatedItems = [...items];
      const existingItem = updatedItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedItems.push({ product, quantity: 1 });
      }

      await updateCart(updatedItems);
      setItems(updatedItems);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setError("Failed to add item");
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: Product["id"]) => {
    setLoading(true);
    try {
      const updatedItems = items.filter(
        (item) => item.product.id !== productId
      );

      await updateCart(updatedItems);
      setItems(updatedItems);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setError("Failed to remove item");
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: Product["id"], quantity: number) => {
    setLoading(true);
    try {
      const updatedItems = items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      await updateCart(updatedItems);
      setItems(updatedItems);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setError("Failed to update quantity");
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal(items);

  return (
    <CartContext.Provider
      value={{
        state: { items, total, loading, error },
        addItem,
        removeItem,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error("useCart must be used within a CartProvider");

  return context;
};
