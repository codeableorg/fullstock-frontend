import { type CartItem } from "@/models/cart.model";
import { User } from "@/models/user.model";
import { mockProducts } from "./products.mock";

// Mock backend storage
const userCarts = new Map<User["id"], CartItem[]>();

userCarts.set("1", [
  { product: mockProducts[0], quantity: 1 },
  { product: mockProducts[1], quantity: 2 },
]);

export function getCart(userId?: string): Promise<CartItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        // Get cart from mock backend for authenticated users
        resolve(userCarts.get(userId) || []);
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
        userCarts.set(userId, items);
      } else {
        // Store cart in localStorage for anonymous users
        localStorage.setItem("cart-items", JSON.stringify(items));
      }
      resolve();
    }, 350);
  });
}

export function clearLocalCart(): void {
  localStorage.removeItem("cart-items");
}
