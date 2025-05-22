import { serverClient } from "@/lib/client.server";
import { type Cart, type CartItem } from "@/models/cart.model";

export async function getRemoteCart(request: Request): Promise<Cart | null> {
  return serverClient<Cart>("/cart", request);
}

export async function createRemoteItems(
  request: Request,
  items: CartItem[]
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
  request: Request,
  productId: number,
  quantity: number = 1
): Promise<Cart> {
  return serverClient<Cart>("/cart/add-item", request, {
    body: { productId, quantity },
  });
}

export async function deleteRemoteCartItem(
  request: Request,
  itemId: CartItem["id"]
): Promise<Cart> {
  return serverClient(`/cart/delete-item/${itemId}`, request, {
    method: "DELETE",
  });
}

export async function deleteRemoteCart(request: Request): Promise<void> {
  return serverClient("/cart", request, {
    method: "DELETE",
  });
}

export async function linkCartToUser(request: Request): Promise<Cart | null> {
  return serverClient<Cart>("/cart/link-to-user", request, {
    method: "POST",
  });
}

export async function mergeGuestCartWithUserCart(
  request: Request
): Promise<Cart | null> {
  return serverClient<Cart>("/cart/merge-guest-cart", request, {
    method: "POST",
  });
}
