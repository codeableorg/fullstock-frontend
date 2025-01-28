import { CartItem } from "../cart/cart.types";
import { orderSchema } from "./order.schema";

export const OrderService = {
  createOrder(
    items: CartItem[],
    formData: FormData
  ): Promise<{ orderId: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const details = Object.fromEntries(formData);

        try {
          const validatedData = orderSchema.parse(details);

          const orderId = crypto.randomUUID();
          console.log("Order created:", {
            orderId,
            items,
            details: validatedData,
          });
          resolve({ orderId });
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  },
};
