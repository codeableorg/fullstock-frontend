import { serverClient } from "@/lib/client.server";
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
  let endpoint = `/cart`;

  if (!cartSessionId && !token) return null;
  if (cartSessionId && !token) {
    endpoint = `/cart/${cartSessionId}`;
  }

  try {
    return serverClient<Cart>(endpoint, token);
  } catch (error) {
    console.error("Error fetching current user:", error);
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
  cartId: number | null,
  productId: number,
  quantity: number = 1,
  request: Request
): Promise<Cart> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");
  let endpoint = "/cart/add-item-without-auth";
  if (token) endpoint = `/cart/add-item`;

  return serverClient<Cart>(endpoint, token, {
    body: { cartId, productId, quantity },
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
  let endpoint = `/cart/delete-item-without-auth/${cartId}/${itemId}`;
  if (token) endpoint = `/cart/delete-item/${itemId}`;

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
