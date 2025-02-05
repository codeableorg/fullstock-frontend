import { carts } from "@/fixtures/carts.fixture";
import { Cart, type CartItem } from "@/models/cart.model";

export function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
}

export function getCart(userId?: string): Promise<Cart | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        // Get cart from mock backend for authenticated users
        const cart = carts.find((c) => c.userId === userId);
        resolve(cart || null);
      } else {
        // Get cart from localStorage for anonymous users
        const savedCart = localStorage.getItem("cart");
        resolve(savedCart ? JSON.parse(savedCart) : null);
      }
    }, 350);
  });
}

export function updateCart(items: CartItem[], userId?: string): Promise<Cart> {
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

export function deleteCart(userId?: string): Promise<void> {
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
