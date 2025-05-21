import { serverClient } from "@/lib/client.server";
import { type Cart, type CartItem } from "@/models/cart.model";

export async function getCurrentCart(request: Request): Promise<Cart | null> {
  try {
    return serverClient<Cart>("/cart", request);
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
  return serverClient<Cart>("/cart/add-item", request, {
    body: { productId, quantity },
  });
}

export async function deleteRemoteCartItem(
  itemId: CartItem["id"],
  request: Request
): Promise<Cart> {
  const endpoint = `/cart/delete-item/${itemId}`;

  return serverClient(endpoint, request, {
    method: "DELETE",
  });
}
