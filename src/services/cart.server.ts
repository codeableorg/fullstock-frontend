import { LOCAL_CART_KEY } from "@/config";
import { serverClient } from "@/lib/client.server";
import { client } from "@/lib/utils";
import { type Cart, type CartItem } from "@/models/cart.model";
import { getSession } from "@/session.server";
import { request } from "http";

// export function getLocalCart(): Cart | null {
//   const cart = localStorage.getItem(LOCAL_CART_KEY);
//   return cart ? JSON.parse(cart) : null;
// }

// export function setLocalCart(cart: Cart): void {
//   localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
// }

// export async function getRemoteCart(request: Request): Promise<Cart | null> {
//   return serverClient<Cart>("/cart", request);
// }

export async function getCurrentCart(request: Request): Promise<Cart | null> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const cartSessionId = session.get("cartSessionId");

  if (!cartSessionId) return null;

  try {
    return serverClient<Cart>("/cart", request);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function createRemoteItems(
  items: CartItem[],
  request: Request
): Promise<Cart> {
  const payload = {
    items: items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    })),
  };

  return serverClient<Cart>("/cart/create-items", request, {
    body: payload,
  });
}

export async function alterQuantityCartItem(
  cartId: number,
  productId: number,
  quantity: number = 1,
  request: Request
): Promise<Cart> {
  return serverClient<Cart>("/cart/add-item-without-auth", request, {
    body: { cartId, productId, quantity },
  });
}

export async function deleteRemoteCartItem(
  cartId: Cart["id"],
  itemId: CartItem["id"],
  request: Request
): Promise<Cart> {
  return serverClient(
    `/cart/delete-item-without-auth/${cartId}/${itemId}`,
    request,
    {
      method: "DELETE",
    }
  );
}

// export async function deleteRemoteCart(): Promise<void> {
//   return client("/cart", {
//     method: "DELETE",
//   });
// }

// export function deleteLocalCart(): void {
//   localStorage.removeItem(LOCAL_CART_KEY);
// }
