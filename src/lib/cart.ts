import type { CartItem } from "@/models/cart.model";
import { type Product } from "@/models/product.model";
import {
  alterQuantityCartItem,
  // createRemoteItems,
  deleteRemoteCartItem,
  getCurrentCart,
  // getRemoteCart,
} from "@/services/cart.server";
import { getProductById } from "@/services/product.server";

import { commitSession, getSession } from "@/session.server";

export async function getCart(request: Request) {
  try {
    const cart = await getCurrentCart(request);

    return cart;
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
      cart?.id || null,
      product.id,
      quantity,
      request
    );

    if (!cart && updatedCart) {
      const cookieHeader = request.headers.get("Cookie");
      const session = await getSession(cookieHeader);
      session.set("cartSessionId", updatedCart.id);
      const committedSession = await commitSession(session);

      return {
        cart: updatedCart,
        headers: {
          "Set-Cookie": committedSession,
        },
      };
    }

    return { cart: updatedCart };
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
