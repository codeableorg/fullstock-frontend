import { mockProducts } from "../products/mockProducts";
import { type CartItem } from "./cart.types";

const defaultCartItems: CartItem[] = [
  { product: mockProducts[0], quantity: 1 }, // Polo React
  { product: mockProducts[7], quantity: 2 }, // Polo It's A Feature
  { product: mockProducts[20], quantity: 1 }, // Coffee.js Mug
];

export const CartService = {
  getCart(): Promise<CartItem[]> {
    return new Promise((resolve) => {
      const savedCart = localStorage.getItem("cart-items");
      setTimeout(() => {
        resolve(savedCart ? JSON.parse(savedCart) : defaultCartItems);
      }, 100);
    });
  },

  updateCart(items: CartItem[]): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem("cart-items", JSON.stringify(items));
      setTimeout(resolve, 100);
    });
  },
};
