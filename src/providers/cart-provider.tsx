import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth.context";
import { CartContext } from "@/contexts/cart.context";
import { Cart, CartItem } from "@/models/cart.model";
import { Product } from "@/models/product.model";
import {
  getCart,
  createItemsCard,
  updateCart,
  deleteCart,
  addItemCart,
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
        const localCart = await getCart(); // obtiene carrito del localstorage
        if (!user) {
          // SIN USUARIO
          setCart(localCart);
          return;
        } else {
          // CON USUARIO
          const remoteCart = await getCart(user.id); // obtiene carrito de la bbdd
          if (remoteCart?.items.length) {
            // CARRITO DDBB CON PRODUCTOS
            setCart(remoteCart);
            deleteCart(); // borra carrito del localstorage
            return;
          } else {
            //CARRITO DDBB SIN PRODUCTOS
            if (localCart) {
              // CARRITO LOCAL CON PRODUCTOS
              const updatedCart = await createItemsCard(localCart.items); // graba carrito local en la bbdd
              console.log(updatedCart);
              deleteCart(); // borra carrito del localstorage
            }
          }
          // return;
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
    // MODIFICAR PARA GRABAR EN LA BBDD
    setLoading(true);
    try {
      const updatedItems = cart ? [...cart.items] : [];
      // const updatedItems: CartItem[] = cart ? [...cart.items] : [];
      const existingItem = updatedItems.find(
        (item) => item.productId === product.id
      );

      if (user) {
        const body: Pick<CartItem, "productId" | "quantity"> = {
          productId: product.id,
          quantity: 1,
        };
        const addItemCard = await addItemCart(body);
        setCart(addItemCard);
      } else {
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          const correlativo = cart ? cart.items.length + 1 : 1;
          updatedItems.push({
            id: correlativo,
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            imgSrc: product.imgSrc,
          });
        }
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
    console.log("Removing");
    // if (!cart) return;
    // setLoading(true);
    // try {
    //   if (!user) {
    //     console.log(productId);
    //     const updatedItems = cart.items.filter(
    //       (item) => item.productId !== productId
    //     );
    //     const updatedCart = await updateCart(updatedItems, user?.id);
    //     setCart(updatedCart);
    //   }else{
    //     console.log("logica para eliminar de la bbdd");
    //   }
    // } catch (error: unknown) {
    //   if (error instanceof Error) {
    //     console.error(error.message);
    //     setError("Failed to remove item");
    //   } else {
    //     throw error;
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  const updateQuantity = async (productId: Product["id"], quantity: number) => {
    console.log("Updating");
    // if (!cart) return;
    // setLoading(true);
    // try {
    //   const updatedItems = cart.items.map((item) =>
    //     item.product.id === productId ? { ...item, quantity } : item
    //   );
    //   const updatedCart = await updateCart(updatedItems, user?.id);
    //   setCart(updatedCart);
    // } catch (error: unknown) {
    //   if (error instanceof Error) {
    //     console.error(error.message);
    //     setError("Failed to update quantity");
    //   } else {
    //     throw error;
    //   }
    // } finally {
    //   setLoading(false);
    // }
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
