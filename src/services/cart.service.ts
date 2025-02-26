import { API_URL } from "@/config";
import { carts } from "@/fixtures/carts.fixture";
import { Cart, type CartItem } from "@/models/cart.model";
import { User } from "@/models/user.model";
import { getToken } from "./auth.service";
import { isApiError } from "@/models/error.model";

export function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
}

export async function getCart(userId?: User["id"]): Promise<Cart | null> {
  if (userId) {
    try {
      const response = await fetch(API_URL + "/cart", {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      });

      const data = (await response.json()) as Cart;

      if (!response.ok) {
        if (isApiError(data)) throw new Error(data.error.message);
        throw new Error("Unknown error");
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Get cart from localStorage for anonymous users
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : null;
}

export function updateCart(
  items: CartItem[],
  userId?: User["id"]
): Promise<Cart> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = calculateTotal(items);
      if (userId) {
        const cart = carts.find((c) => c.userId === userId);
        if (cart) {
          cart.items = items;
          cart.total = total;
          resolve(cart);
        } else {
          const cart = { id: crypto.randomUUID(), userId, items, total };
          carts.push(cart);
          resolve(cart);
        }
      } else {
        const cart = {
          id: crypto.randomUUID(),
          items,
          total,
        };
        localStorage.setItem("cart", JSON.stringify(cart));
        resolve(cart);
      }
    }, 350);
  });
}

export function deleteCart(userId?: User["id"]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        const cartIndex = carts.findIndex((c) => c.userId === userId);
        carts.splice(cartIndex, 1);
      } else {
        localStorage.removeItem("cart");
      }
      resolve();
    }, 350);
  });
}
