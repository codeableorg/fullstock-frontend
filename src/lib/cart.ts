import type { CartItem } from "@/models/cart.model";
import { type Product } from "@/models/product.model";
import { getCurrentUser } from "@/services/auth.server";
import {
  alterQuantityCartItem,
  createRemoteItems,
  deleteRemoteCartItem,
  getCurrentCart,
  // getRemoteCart,
} from "@/services/cart.server";
import { getProductById } from "@/services/product.server";

import { commitSession, getSession } from "@/session.server";
import type { Session, SessionData } from "react-router";

export async function getCart(request: Request) {
  try {
    const cart = await getCurrentCart(request);

    if (!cart) {
      // SIN CART
      return null;
    }

    return cart;

    // CON USUARIO
    //const remoteCart = await getRemoteCart(); // obtiene carrito de la bbdd

    // if (remoteCart!.items.length) {
    //   // CARRITO DDBB CON PRODUCTOS
    //   deleteLocalCart(); // borra carrito del localstorage
    //   return remoteCart;
    // }
    //CARRITO DDBB SIN PRODUCTOS
    // if (localCart) {
    //   // CARRITO LOCAL CON PRODUCTOS
    //   const updatedCart = await createRemoteItems(localCart.items); // graba carrito local en la bbdd
    //   deleteLocalCart(); // borra carrito del localstorage
    //   return updatedCart;
    // } else {
    //   return null; // No hay carrito local ni remoto
    // }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addToCart(
  productId: Product["id"],
  quantity: number = 1,
  request: Request
) {
  const [cart, product] = await Promise.all([
    getCurrentCart(request),
    getProductById(productId, request),
  ]);

  try {
    const updatedCart = await alterQuantityCartItem(
      cart!.id,
      product.id,
      quantity,
      request
    );

    if (!cart && updatedCart) {
      const session = await getSession();
      session.set("cartSessionId", updatedCart.id);
    }

    // const session = await getSession();
    //   session.set("cartSessionId", updatedCart.id);

    //const cart = await getRemoteCart(request); // obtiene carrito del localstorage

    // const updatedItems = updatedCart ? [...updatedCart.items] : [];
    // const existingItem = updatedItems.find(
    //   (item) => item.product.id === product.id
    // );

    // if (existingItem) {
    //   existingItem.quantity += quantity;
    // } else if (quantity > 0) {
    //   updatedItems.push({
    //     id: Date.now(),
    //     product,
    //     quantity,
    //   });
    // }

    // const updatedCart = {
    //   id: Date.now(),
    //   items: updatedItems,
    //   total: updatedItems.reduce(
    //     (total, item) => total + item.product.price * item.quantity,
    //     0
    //   ),
    // };

    //const updatedCart2 = await createRemoteItems(updatedCart.items, request);

    //setLocalCart(updatedCart);

    // const session = await getSession();

    // session.set("cartSessionId", updatedCart.id);

    // console.log(updatedCart.id);

    return updatedCart;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function removeFromCart(itemId: CartItem["id"], request: Request) {
  //const user = await getCurrentUser();

  try {
    const cart = await getCurrentCart(request);
    const updatedCart = await deleteRemoteCartItem(cart!.id, itemId, request);

    //if (user) {
    //const updatedCart = await deleteRemoteCartItem(itemId);
    //return updatedCart;
    //} else {
    //const cart = getLocalCart(); // obtiene carrito del localstorage

    // const updatedItems = cart
    //   ? cart.items.filter((item) => item.id !== itemId)
    //   : [];
    // const updatedCart = {
    //   id: cart?.id || Date.now(),
    //   items: updatedItems,
    //   total: updatedItems.reduce(
    //     (total, item) => total + item.product.price * item.quantity,
    //     0
    //   ),
    // };
    // setLocalCart(updatedCart);
    return updatedCart;
    //}
  } catch (error) {
    console.error(error);
    return null;
  }
}
