import type { CartItem } from "@/models/cart.model";
import { type Product } from "@/models/product.model";
import {
  alterQuantityCartItem,
  deleteRemoteCartItem,
  getRemoteCart,
} from "@/services/cart.service";
import { getProductById } from "@/services/product.server";

export async function getCart(request: Request) {
  try {
    const remoteCart = await getRemoteCart(request);

    // Si ya existe un carrito (con ítems o vacío), lo devolvemos
    if (remoteCart) {
      // Si no existe la propiedad total, calcúlala sumando las cantidades de cada ítem
      if (remoteCart.total === undefined) {
        remoteCart.total =
          remoteCart.items?.reduce((total, item) => total + item.quantity, 0) ||
          0;
      }
      return remoteCart;
    }

    // No se encontró carrito
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addToCart(
  request: Request,
  productId: Product["id"],
  quantity: number = 1
) {
  try {
    const product = await getProductById(request, productId);
    const updatedCart = await alterQuantityCartItem(
      request,
      product.id,
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
