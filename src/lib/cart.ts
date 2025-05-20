import type { CartItem } from "@/models/cart.model";
import { type Product } from "@/models/product.model";
import {
  alterQuantityCartItem,
  // createRemoteItems,
  deleteRemoteCartItem,
  getCurrentCart,
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
  try {
    const product = await getProductById(productId, request);
    const updatedCart = await alterQuantityCartItem(
      product.id,
      quantity,
      request
    );

     if (updatedCart) {
      const session = await getSession(request.headers.get("Cookie"));
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
  try {
    const updatedCart = await deleteRemoteCartItem( itemId, request);

    return updatedCart;
    //}
  } catch (error) {
    console.error(error);
    return null;
  }
}
