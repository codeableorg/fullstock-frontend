import { serverClient } from "@/lib/client.server";
import { getUrlWithParams } from "@/lib/utils";
import { type Cart, type CartItem } from "@/models/cart.model";
import { getSession } from "@/session.server";

export async function getCurrentCart(request: Request): Promise<Cart | null> {
  try {
    return serverClient<Cart>("/cart", request, { includeCartSessionId: true });
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

  const endpoint = getUrlWithParams("/cart/add-item", { cartId: cartSessionId });

  return serverClient<Cart>(endpoint, request, {
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

  const endpoint = getUrlWithParams(`/cart/delete-item/${itemId}`, { cartId: cartSessionId });

  return serverClient(endpoint, request, {
    method: "DELETE"
  });
}


