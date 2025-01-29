import { type CartItem } from "./cart.types";

export function getCart(): Promise<CartItem[]> {
  return new Promise((resolve) => {
    const savedCart = localStorage.getItem("cart-items");
    setTimeout(() => {
      resolve(savedCart ? JSON.parse(savedCart) : []);
    }, 100);
  });
}

export function updateCart(items: CartItem[]): Promise<void> {
  return new Promise((resolve) => {
    localStorage.setItem("cart-items", JSON.stringify(items));
    setTimeout(resolve, 100);
  });
}
