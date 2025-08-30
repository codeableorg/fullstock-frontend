import type { CartItem, CartItemInput } from "@/models/cart.model";
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
  quantity: number = 1,
  productVariantId?: number,
  stickersVariantId?: number
) {
  try {
    const updatedCart = await alterQuantityCartItem(
      userId,
      sessionCartId,
      productId,
      quantity,
      productVariantId,
      stickersVariantId
    );
    return updatedCart;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function removeFromCart(
  userId: number | undefined,
  sessionCartId: string | undefined,
  itemId: CartItem["id"]
) {
  try {
    // La parte del backend determina si es un usuario autenticado o invitado
    const updatedCart = await deleteRemoteCartItem(
      userId,
      sessionCartId,
      itemId
    );
    return updatedCart;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function calculateTotal(items: CartItem[]): number;
export function calculateTotal(items: CartItemInput[]): number;

export function calculateTotal(items: CartItem[] | CartItemInput[]): number {
  return items.reduce((total, item) => {
    
    if ("product" in item) {
     
      return total + item.price * item.quantity;
    } else {
      
      return total + item.price * item.quantity;
    }
  }, 0);
}
