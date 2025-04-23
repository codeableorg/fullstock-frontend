import { CartItem } from "@/models/cart.model";
import { Product } from "@/models/product.model";
import { getCurrentUser } from "@/services/auth.service";
import {
  alterQuantityCartItem,
  createRemoteItems,
  deleteLocalCart,
  deleteRemoteCartItem,
  getLocalCart,
  getRemoteCart,
  setLocalCart,
} from "@/services/cart.service";
import { getProductById } from "@/services/product.service";

export async function getCart() {
  const user = await getCurrentUser();

  try {
    const localCart = getLocalCart(); // obtiene carrito del localstorage

    if (!user) {
      // SIN USUARIO
      return localCart;
    }

    // CON USUARIO
    const remoteCart = await getRemoteCart(); // obtiene carrito de la bbdd

    if (remoteCart?.items.length) {
      // CARRITO DDBB CON PRODUCTOS
      deleteLocalCart(); // borra carrito del localstorage
      return remoteCart;
    }
    //CARRITO DDBB SIN PRODUCTOS
    if (localCart) {
      // CARRITO LOCAL CON PRODUCTOS
      const updatedCart = await createRemoteItems(localCart.items); // graba carrito local en la bbdd
      deleteLocalCart(); // borra carrito del localstorage
      return updatedCart;
    } else {
      return null; // No hay carrito local ni remoto
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addToCart(
  productId: Product["id"],
  quantity: number = 1
) {
  const [user, product] = await Promise.all([
    getCurrentUser(),
    getProductById(productId),
  ]);

  try {
    if (user) {
      const updatedCart = await alterQuantityCartItem(product.id, quantity);
      return updatedCart;
    }

    const cart = getLocalCart(); // obtiene carrito del localstorage

    const updatedItems = cart ? [...cart.items] : [];
    const existingItem = updatedItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else if (quantity > 0) {
      updatedItems.push({
        id: Date.now(),
        product,
        quantity,
      });
    }

    const updatedCart = {
      id: Date.now(),
      items: updatedItems,
      total: updatedItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    };
    setLocalCart(updatedCart);
    return updatedCart;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function removeFromCart(itemId: CartItem["id"]) {
  const user = await getCurrentUser();

  try {
    if (user) {
      const updatedCart = await deleteRemoteCartItem(itemId);
      return updatedCart;
    } else {
      const cart = getLocalCart(); // obtiene carrito del localstorage

      const updatedItems = cart
        ? cart.items.filter((item) => item.id !== itemId)
        : [];
      const updatedCart = {
        id: cart?.id || Date.now(),
        items: updatedItems,
        total: updatedItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      };
      setLocalCart(updatedCart);
      return updatedCart;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
