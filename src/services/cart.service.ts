import { carts } from "@/fixtures/carts.fixture";
import { type CartItem } from "@/models/cart.model";

export function getCart(userId?: string): Promise<CartItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        // Get cart from mock backend for authenticated users
        resolve(carts.get(userId) || []);
      } else {
        // Get cart from localStorage for anonymous users
        const savedCart = localStorage.getItem("cart-items");
        resolve(savedCart ? JSON.parse(savedCart) : []);
      }
    }, 350);
  });
}

export function updateCart(items: CartItem[], userId?: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        // Store cart in mock backend for authenticated users
        carts.set(userId, items);
      } else {
        // Store cart in localStorage for anonymous users
        localStorage.setItem("cart-items", JSON.stringify(items));
      }
      resolve();
    }, 350);
  });
}

export function deleteCart(userId?: string): void {
  if (userId) {
    carts.delete(userId);
  } else {
    localStorage.removeItem("cart-items");
  }
}
