import { type Cart, type CartItem } from "@/models/cart.model";
import type { User } from "@/models/user.model";
import * as cartRepository from "@/repositories/cart.repository";
import { getSession } from "@/session.server";

export async function getRemoteCart(userId: User["id"]): Promise<Cart | null> {
  const cart = await cartRepository.getCart(userId, undefined);
  return cart;
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

export async function linkCartToUser(
  userId: User["id"],
  sessionCartId: string
): Promise<Cart | null> {
  if (!sessionCartId) throw new Error("Session cart ID not found");
  if (!userId) throw new Error("User ID not found");

  const updatedCart = await cartRepository.updateCartBySessionId(
    sessionCartId,
    userId
  );

  if (!updatedCart) throw new Error("Cart not found after linking");

  return updatedCart;
}

export async function mergeGuestCartWithUserCart(
  userId: User["id"],
  sessionCartId: string
): Promise<Cart | null> {
  const mergedCart = await cartRepository.mergeGuestCartWithUserCart(
    userId,
    sessionCartId
  );

  if (!mergedCart) throw new Error("Cart not found after merging");

  return mergedCart;
}
