import { CartItem } from "@/services/carts/cart.types";

export function createOrder(
  items: CartItem[],
  formData: FormData
): Promise<{ orderId: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const details = Object.fromEntries(formData);
      const orderId = crypto.randomUUID();

      console.log("Order created:", {
        orderId,
        items,
        details,
      });
      resolve({ orderId });
    }, 1000);
  });
}
