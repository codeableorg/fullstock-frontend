import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth.context";
import { CartContext } from "@/contexts/cart.context";
import { Cart } from "@/models/cart.model";
import { Product } from "@/models/product.model";
import {
  deleteCart,
  getLocalCart,
  getRemoteCart,
  deleteLocalCart,
  createRemoteItems,
  addCartItem,
  setLocalCart,
} from "@/services/cart.service";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const localCart = getLocalCart(); // obtiene carrito del localstorage

        if (!user) {
          // SIN USUARIO
          setCart(localCart);
          return;
        }

        // CON USUARIO
        const remoteCart = await getRemoteCart(); // obtiene carrito de la bbdd
        if (remoteCart?.items.length) {
          // CARRITO DDBB CON PRODUCTOS
          setCart(remoteCart);
          deleteLocalCart(); // borra carrito del localstorage
          return;
        }
        //CARRITO DDBB SIN PRODUCTOS
        if (localCart) {
          // CARRITO LOCAL CON PRODUCTOS
          const updatedCart = await createRemoteItems(localCart.items); // graba carrito local en la bbdd
          setCart(updatedCart);
          deleteLocalCart(); // borra carrito del localstorage
        }
      } catch (error) {
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const addItem = async (product: Product, quantity: number = 1) => {
    // MODIFICAR PARA GRABAR EN LA BBDD
    setLoading(true);
    try {
      if (user) {
        const updatedCart = await addCartItem(product.id, quantity);
        setCart(updatedCart);
        return;
      }

      const updatedItems = cart ? [...cart.items] : [];
      const existingItem = updatedItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else if (quantity > 0) {
        updatedItems.push({
          id: Date.now(),
          product,
          quantity,
        });
      }

      const updatedCart = {
        id: Date.now(),
        items: updatedItems,
        total: updatedItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      };
      setLocalCart(updatedCart);
      setCart(updatedCart);
    } catch (error) {
      setError("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (user) deleteCart();
      else deleteLocalCart();
      setCart(null);
    } catch (error) {
      setError("Failed to clear cart");
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
