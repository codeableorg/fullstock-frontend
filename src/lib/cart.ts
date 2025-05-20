import type { Cart, CartItem } from "@/models/cart.model";
import { type Product } from "@/models/product.model";
import {
  getCurrentCart
} from "@/services/cart.server";
import { commitSession, getSession } from "@/session.server";
import { serverClient } from "./client.server";

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
    const updatedCart = await serverClient<Cart>("/cart/add-item", request, {
      body: { productId, quantity },
      includeCartSessionId: true,
    });

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
    console.error("Error adding to cart:", error);
    return null;
  }
}

export async function removeFromCart(itemId: CartItem["id"], request: Request) {
  try {
    return serverClient<Cart>(`/cart/delete-item/${itemId}`, request, {
      method: "DELETE",
      includeCartSessionId: true,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return null;
  }
}
