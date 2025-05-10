import { client } from "@/lib/utils";
import { type Cart, type CartItem } from "@/models/cart.model";
import { getCardIdFromSession } from "@/session.server";

// export function getLocalCart(): Cart | null {
//   const cart = localStorage.getItem(LOCAL_CART_KEY);
//   return cart ? JSON.parse(cart) : null;
// }

// export function setLocalCart(cart: Cart): void {
//   localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
// }

export async function getGuestCart() : Promise<Cart | null> {
  const cartId = await getCardIdFromSession();
  if (!cartId) return null;

  return client<Cart>(`/cart/${cartId}`); // END POINT A CREAR
}

export async function getUserCart(): Promise<Cart | null> {
  return client<Cart>("/cart"); // POR EMAIL DEL TOKEN
}

export async function createGuestCart(): Promise<Cart> {  // END POINT A CREAR
  const cartId = await getCardIdFromSession();
  if (!cartId) {
    throw new Error("No cartId found in session");
  }
  return client<Cart>(`/cart`, {
    method: "POST",
    body: { cartId },
  });
}

// AQUI NOS QUEDAMOS

export async function createRemoteItems(items: CartItem[]): Promise<Cart> {
  const payload = {
    items: items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    })),
  };

  return client<Cart>("/cart/create-items", {
    body: payload,
  });
}

export async function alterQuantityCartItem(
  productId: number,
  quantity: number = 1
): Promise<Cart> {
  return client<Cart>("/cart/add-item", {
    body: { productId, quantity },
  });
}

export async function deleteRemoteCartItem(
  itemId: CartItem["id"]
): Promise<Cart> {
  return client(`/cart/delete-item/${itemId}`, {
    method: "DELETE",
  });
}

export async function deleteRemoteCart(): Promise<void> {
  return client("/cart", {
    method: "DELETE",
  });
}

// export function deleteLocalCart(): void {
//   localStorage.removeItem(LOCAL_CART_KEY);
// }

export async function getGuestCartId(): Promise<string> {
  return client("/cart/guest-cart-id", {
    method: "POST",
  });
}


