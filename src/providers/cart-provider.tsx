import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth.context";
import { CartContext } from "@/contexts/cart.context";
import { Cart } from "@/models/cart.model";
import { Product } from "@/models/product.model";
import { deleteCart, getCart, updateCart } from "@/services/cart.service";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const localCart = await getCart();

        if (!user) {
          setCart(localCart);
          return;
        }

        const remoteCart = await getCart(user.id);

        if (remoteCart?.items.length) {
          setCart(remoteCart);
          deleteCart();
          return;
        }

        if (localCart) {
          setCart(localCart);
          await updateCart(localCart.items, user.id);
          deleteCart();
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

  const addItem = async (product: Product) => {

    setLoading(true);
    
    try {
      const updatedItems = cart ? [...cart.items] : [];
           
      const existingItem = updatedItems.find(
        (item) => item.product.id === product.id
        
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedItems.push({ product, quantity: 1 });
      }

      const updatedCart = await updateCart(updatedItems, user?.id);

      setCart(updatedCart);
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
    if (!cart) return;
    setLoading(true);
    try {
      const updatedItems = cart.items.filter(
        (item) => item.product.id !== productId
      );

      const updatedCart = await updateCart(updatedItems, user?.id);
      setCart(updatedCart);
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
    if (!cart) return;
    setLoading(true);
    try {
      const updatedItems = cart.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      const updatedCart = await updateCart(updatedItems, user?.id);
      setCart(updatedCart);
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

  const clearCart = async () => {
    setLoading(true);
    try {
      await deleteCart(user?.id);
      setCart(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError("Failed to clear cart");
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
