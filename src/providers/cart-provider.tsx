import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth.context";
import { CartContext } from "@/contexts/cart.context";
import { CartItem } from "@/models/cart.model";
import { Product } from "@/models/product.model";
import { clearLocalCart, getCart, updateCart } from "@/services/cart.service";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const localCart = await getCart();
        const userCart = user?.id ? await getCart(user.id) : null;

        if (user?.id) {
          if (userCart?.length) {
            setItems(userCart);
          } else {
            setItems(localCart);
            await updateCart(localCart, user.id);
          }
          clearLocalCart();
        } else {
          setItems(localCart);
        }
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
  }, [user]);

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

      await updateCart(updatedItems, user?.id);
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

      await updateCart(updatedItems, user?.id);
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

      await updateCart(updatedItems, user?.id);
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
