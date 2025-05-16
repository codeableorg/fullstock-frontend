import { serverClient } from "@/lib/client.server";
import { getUrlWithParams } from "@/lib/utils";
import { type Cart, type CartItem } from "@/models/cart.model";
import { getSession } from "@/session.server";


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



export async function alterQuantityCartItem(
  productId: number,
  quantity: number = 1,
  request: Request
): Promise<Cart> {
  const session = await getSession(request.headers.get("Cookie"));
  const cartSessionId = session.get("cartSessionId");
  const token = session.get("token");

  const endpoint = getUrlWithParams("/cart/add-item", { cartSessionId });

  return serverClient<Cart>(endpoint, token, {
    body: { productId, quantity }
  });
}

export async function deleteRemoteCartItem(
  itemId: CartItem["id"],
  request: Request
): Promise<Cart> {
  const session = await getSession(request.headers.get("Cookie"));
  const cartSessionId = session.get("cartSessionId");
  const token = session.get("token");

  const endpoint = getUrlWithParams(`/cart/delete-item/${itemId}`, { cartSessionId });

  return serverClient(endpoint, token, {
    method: "DELETE"
  });
}


