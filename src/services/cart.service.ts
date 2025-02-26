import { API_URL, LOCAL_CART_KEY } from "@/config";
import { Cart, type CartItem } from "@/models/cart.model";
import { getToken } from "./auth.service";
import { isApiError } from "@/models/error.model";

export function getLocalCart(): Cart | null {
  const cart = localStorage.getItem(LOCAL_CART_KEY);
  return cart ? JSON.parse(cart) : null;
}

export function setLocalCart(cart: Cart): void {
  localStorage.set(LOCAL_CART_KEY, JSON.stringify(cart));
}

export async function getRemoteCart(): Promise<Cart | null> {
  try {
    // Get cart from backend for authenticated users
    const token = getToken();
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data as Cart;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createRemoteItems(items: CartItem[]): Promise<Cart> {
  try {
    const payload = {
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
    };

    const token = getToken();

    const response = await fetch(`${API_URL}/cart/create-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data as Cart;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addCartItem(
  productId: number,
  quantity: number = 1
): Promise<Cart> {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/cart/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data as Cart;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCartItem(itemId: CartItem["id"]): Promise<Cart> {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/cart/delete-item/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data as Cart;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCart(): Promise<void> {
  const token = getToken();
  fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteLocalCart(): void {
  localStorage.removeItem(LOCAL_CART_KEY);
}
