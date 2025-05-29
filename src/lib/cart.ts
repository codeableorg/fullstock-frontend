import type { CartItem } from "@/models/cart.model";
import { type Product } from "@/models/product.model";
import {
  alterQuantityCartItem,
  deleteRemoteCartItem,
  getOrCreateCart,
} from "@/services/cart.service";

export async function getCart(userId?: number, sessionCartId?: string) {
  try {
    return getOrCreateCart(userId, sessionCartId);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addToCart(
  userId: number | undefined,
  sessionCartId: string | undefined,
  productId: Product["id"],
  quantity: number = 1
) {
  try {
    const updatedCart = await alterQuantityCartItem(
      userId,
      sessionCartId,
      productId,
      quantity
    );
    return updatedCart;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function removeFromCart(request: Request, itemId: CartItem["id"]) {
  try {
    // El backend determinará si es un usuario autenticado o invitado
    const updatedCart = await deleteRemoteCartItem(request, itemId);
    return updatedCart;
  } catch (error) {
    console.error(error);
    return null;
  }
}
