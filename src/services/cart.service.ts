import { API_URL } from "@/config";
// import { carts } from "@/fixtures/carts.fixture";
import { Cart, type CartItem } from "@/models/cart.model";
import { User } from "@/models/user.model";
// import { getToken } from "./auth.service";
import { isApiError } from "@/models/error.model";

export function calculateTotal(items: CartItem[]): number {
  if (items.length) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  return 0;
}

export async function getCart(userId?: number): Promise<Cart | null> {
  try {
    if (userId) {
      // Get cart from backend for authenticated users
      const token = localStorage.getItem("auth_token");
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
    } else {
      // Get cart from localStorage for anonymous users
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createItemsCard(items: CartItem[]): Promise<Cart> {
  try {
    const payload = {
      items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    };
    const token = localStorage.getItem("auth_token");
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

export async function addItemCart(
  item: Pick<CartItem, "productId" | "quantity">
): Promise<Cart> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/cart/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
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

export async function deleteItemCart(userId: number): Promise<Cart> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/cart/delete-item/${userId}`, {
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

export async function updateCart(
  items: CartItem[],
  userId?: number
): Promise<Cart> {
  try {
    const total = calculateTotal(items);
    if (userId) {
      const token = localStorage.getItem("auth_token");
      console.log(token);
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cart = await response.json();
      cart.total = total;
      return cart as Cart;
    } else {
      const cart = {
        id: crypto.randomUUID(),
        items,
        total,
      };
      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function deleteCart(userId?: User["id"]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        // const cartIndex = carts.findIndex((c) => c.userId === userId);
        // carts.splice(cartIndex, 1);
      } else {
        localStorage.removeItem("cart");
      }
      resolve();
    }, 350);
  });
}
