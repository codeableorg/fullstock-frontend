import { API_URL } from "@/config";
import { carts } from "@/fixtures/carts.fixture";
import { Cart, type CartItem } from "@/models/cart.model";

const TOKEN_KEY = "auth_token";

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
    setTimeout(async () => {

      const total = calculateTotal(items);

      if (userId) {

        const authToken = localStorage.getItem(TOKEN_KEY) || '';

        for (const item of items) {

          try {
            const response = await fetch(`${API_URL}/cart/items`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken.trim()}`
              },
              body: JSON.stringify({
                productId: item.product.id,
                quantity: item.quantity
              })
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const cart = { id: data.cartId, items, total };
            resolve(cart);
          } catch (error) {
            console.error('Error:', error);
            throw error;
          }

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
