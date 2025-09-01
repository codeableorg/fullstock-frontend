import type { CartItem, CartItemWithProduct } from "@/models/cart.model";
// import { type Product } from "@/models/product.model";
import { type VariantAttributeValue } from "@/models/variant-attribute.model";
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
  attributeValueId: VariantAttributeValue["id"],
  quantity: number = 1
) {
  try {
    const updatedCart = await alterQuantityCartItem(
      userId,
      sessionCartId,
      attributeValueId,
      quantity
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
    // El backend determinará si es un usuario autenticado o invitado
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

// Función para CartItem
function calculateCartItemTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = item.variantAttributeValue ? Number(item.variantAttributeValue.price) || 0 : 0;
    return total + (price * item.quantity);
  }, 0);
}

// Función para CartItemWithProduct
function calculateCartItemWithProductTotal(items: CartItemWithProduct[]): number {
  return items.reduce((total, item) => {
    const price = typeof item.product.price === 'number' ? item.product.price : 0;
    return total + (price * item.quantity);
  }, 0);
}

export function calculateTotal(items: CartItem[]): number;
export function calculateTotal(items: CartItemWithProduct[]): number;

export function calculateTotal(items: CartItem[] | CartItemWithProduct[]): number {
  // Verificar si es CartItemWithProduct comprobando la estructura
  if (items.length > 0 && 'product' in items[0]) {
    return calculateCartItemWithProductTotal(items as CartItemWithProduct[]);
  } else {
    return calculateCartItemTotal(items as CartItem[]);
  }
}
