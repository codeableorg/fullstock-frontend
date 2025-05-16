import { serverClient } from "@/lib/client.server";
import { getUrlWithParams } from "@/lib/utils";
import { type Cart, type CartItem } from "@/models/cart.model";
import { getSession } from "@/session.server";

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
  const token = session.get("token");
  const endpoint = getUrlWithParams("/cart", { cartId: cartSessionId });

  if (!cartSessionId && !token) return null;

  try {
    return serverClient<Cart>(endpoint, token);
  } catch (error) {
    console.error("Error fetching current cart:", error);
    return null;
  }
}

// export async function createRemoteItems(
//   items: CartItem[],
//   request: Request
// ): Promise<Cart> {
//   const payload = {
//     items: items.map(({ product, quantity }) => ({
//       productId: product.id,
//       quantity,
//     })),
//   };

//   const cookieHeader = request.headers.get("Cookie");
//   const session = await getSession(cookieHeader);
//   const token = session.get("token");
//   let endpoint = "/cart/add-item-without-auth";
//   if (token) endpoint = `/add-item`;

//   return serverClient<Cart>("/cart/create-items", request, {
//     body: payload,
//   });
// }

export async function alterQuantityCartItem(
  cartId: Cart["id"],
  productId: number,
  quantity: number = 1,
  request: Request
): Promise<Cart> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");
  const endpoint = getUrlWithParams("/cart/add-item", { cartId });

  return serverClient<Cart>(endpoint, token, {
    body: { productId, quantity },
  });
}

export async function deleteRemoteCartItem(
  cartId: Cart["id"],
  itemId: CartItem["id"],
  request: Request
): Promise<Cart> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");
  const endpoint = getUrlWithParams(`/cart/delete-item/${itemId}`, { cartId });

  //let endpoint = `/cart/delete-item-without-auth/${cartId}/${itemId}`;
  //if (token) endpoint = `/cart/delete-item/${itemId}`;

  return serverClient(endpoint, token, {
    method: "DELETE",
  });
}

// export async function deleteRemoteCart(): Promise<void> {
//   return client("/cart", {
//     method: "DELETE",
//   });
// }

// export function deleteLocalCart(): void {
//   localStorage.removeItem(LOCAL_CART_KEY);
// }
