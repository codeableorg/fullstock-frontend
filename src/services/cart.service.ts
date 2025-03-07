import { LOCAL_CART_KEY } from "@/config";
import { client } from "@/lib/utils";
import { Cart, type CartItem } from "@/models/cart.model";

export function getLocalCart(): Cart | null {
  const cart = localStorage.getItem(LOCAL_CART_KEY);
  return cart ? JSON.parse(cart) : null;
}

export function setLocalCart(cart: Cart): void {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

export async function getRemoteCart(): Promise<Cart | null> {
  return client<Cart>('/cart');
}

export async function createRemoteItems(items: CartItem[]): Promise<Cart> {
  const payload = {
    items: items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    })),
  };

  return client<Cart>('/cart/create-items', {
    data: payload
  });
}

export async function alterQuantityCartItem(
  productId: number,
  quantity: number = 1
): Promise<Cart> {
  return client<Cart>('/cart/add-item', {
    data: { productId, quantity }
  });
}

export async function deleteRemoteCartItem(
  itemId: CartItem["id"]
): Promise<Cart> {
  return client(`/cart/delete-item/${itemId}`, {
    method: 'DELETE'
  });
}

export async function deleteRemoteCart(): Promise<void> {
  return client('/cart', {
    method: 'DELETE'
  });
}

export function deleteLocalCart(): void {
  localStorage.removeItem(LOCAL_CART_KEY);
}
