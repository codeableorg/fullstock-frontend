import { serverClient } from "@/lib/client.server";
import { type Cart, type CartItem } from "@/models/cart.model";

export async function getRemoteCart(
  request: Request,
  cartSessionId?: string
): Promise<Cart | null> {
  return serverClient<Cart>("/cart", request, {
    headers: cartSessionId ? { "x-cart-id": cartSessionId } : {},
  });
}

export async function createRemoteItems(
  request: Request,
  items: CartItem[],
  cartSessionId?: string
): Promise<Cart> {
  const payload = {
    items: items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    })),
  };

  return serverClient<Cart>("/cart/create-items", request, {
    body: payload,
    headers: cartSessionId ? { "x-cart-id": cartSessionId } : {},
  });
}

export async function alterQuantityCartItem(
  request: Request,
  productId: number,
  quantity: number = 1,
  cartSessionId?: string
): Promise<Cart> {
  return serverClient<Cart>("/cart/add-item", request, {
    body: { productId, quantity },
    headers: cartSessionId ? { "x-cart-id": cartSessionId } : {},
  });
}

export async function deleteRemoteCartItem(
  request: Request,
  itemId: CartItem["id"],
  cartSessionId?: string
): Promise<Cart> {
  return serverClient(`/cart/delete-item/${itemId}`, request, {
    method: "DELETE",
    headers: cartSessionId ? { "x-cart-id": cartSessionId } : {},
  });
}

export async function deleteRemoteCart(
  request: Request,
  cartSessionId?: string
): Promise<void> {
  return serverClient("/cart", request, {
    method: "DELETE",
    headers: cartSessionId ? { "x-cart-id": cartSessionId } : {},
  });
}

export async function linkCartToUser(
  request: Request,
  cartSessionId: string
): Promise<Cart | null> {
  return serverClient<Cart>("/cart/link-to-user", request, {
    method: "POST",
    headers: cartSessionId ? { "x-cart-id": cartSessionId } : {},
  });
}

export async function mergeGuestCartWithUserCart(
  request: Request,
  cartSessionId: string
): Promise<Cart | null> {
  return serverClient<Cart>("/cart/merge-guest-cart", request, {
    method: "POST",
    headers: { "x-cart-id": cartSessionId },
  });
}

