import { serverClient } from "@/lib/client.server";
import { type Cart, type CartItem } from "@/models/cart.model";
import type { User } from "@/models/user.model";
import * as cartRepository from "@/repositories/cart.repository";
import { getSession } from "@/session.server";

export async function getRemoteCart(request: Request): Promise<Cart | null> {
  return serverClient<Cart>("/cart", request);
}

export async function getOrCreateCart(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined
) {
  let cart: Cart | null = null;

  cart = await cartRepository.getCart(userId, sessionCartId);

  // Si no se encontró un carrito creamos uno nuevo
  if (!cart) {
    // Creamos un carrito sin userId ni sessionCartId, dejando que la BD genere el UUID
    cart = await cartRepository.createCart();
    // Si se crea el carrito, lo vinculamos a un usuario si se proporciona un userId
    if (cart && userId) {
      await cartRepository.updateCartWithUserId(cart.id, userId);
    }
  }

  if (!cart) throw new Error("Failed to create cart");

  return cart;
}

export async function createRemoteItems(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined,
  items: CartItem[] = []
): Promise<Cart> {
  const mappedItems = items.map(({ product, quantity }) => ({
    productId: product.id,
    quantity,
  }));

  const cart = await getOrCreateCart(userId, sessionCartId);
  console.log("Cart", cart);

  if (cart.items.length > 0) {
    await cartRepository.clearCart(cart.id);
  }

  // Si hay elementos para agregar, agregarlos
  if (items.length > 0) {
    await cartRepository.addCartItems(cart.id, mappedItems);
  }

  const updatedCart = await cartRepository.getCart(
    userId,
    sessionCartId,
    cart.id
  );

  if (!updatedCart) throw new Error("Cart not found after creation");

  return updatedCart;
}

export async function alterQuantityCartItem(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined,
  productId: number,
  quantity: number = 1
): Promise<Cart> {
  const cart = await getOrCreateCart(userId, sessionCartId);

  const existingItem = cart.items.find((item) => item.product.id === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity <= 0)
      throw new Error("Cannot set item quantity to 0 or less");

    await cartRepository.updateCartItem(cart.id, existingItem.id, newQuantity);
  } else {
    await cartRepository.addCartItem(cart.id, productId, quantity);
  }

  const updatedCart = await cartRepository.getCart(
    userId,
    cart.sessionCartId,
    cart.id
  );

  if (!updatedCart) throw new Error("Cart not found after update");

  return updatedCart;
}

export async function deleteRemoteCartItem(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined,
  itemId: CartItem["id"]
): Promise<Cart> {
  let cart: Cart | null = null;

  if (userId || sessionCartId) {
    cart = await cartRepository.getCart(userId, sessionCartId);
  }

  if (!cart) throw new Error("Cart not found");

  await cartRepository.removeCartItem(cart.id, itemId);

  const updatedCart = await getOrCreateCart(userId, sessionCartId);
  return updatedCart;
}

export async function deleteRemoteCart(request: Request): Promise<void> {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");
  const userId = session.get("userId");

  let cart: Cart | null = null;

  if (userId || sessionCartId) {
    cart = await cartRepository.getCart(userId, sessionCartId);
  }

  if (!cart) throw new Error("Cart not found");
  await cartRepository.clearCart(cart.id);
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
