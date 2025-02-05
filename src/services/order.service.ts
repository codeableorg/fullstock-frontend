import { CartItem } from "@/models/cart.model";
import { Order, OrderDetails } from "@/models/order.model";
import { findOrCreateGuestUser } from "./user.service";
import { orders } from "@/fixtures/orders.fixture";

export async function createOrder(
  items: CartItem[],
  formData: FormData
): Promise<{ orderId: string }> {
  const details = Object.fromEntries(formData) as unknown as OrderDetails;
  const user = await findOrCreateGuestUser(details.email);

  const order: Order = {
    id: crypto.randomUUID(),
    userId: user.id,
    items,
    details,
    createdAt: new Date(),
  };

  orders.push(order);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ orderId: order.id });
    }, 1000);
  });
}

export function getOrdersByUser(userId: string): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userOrders = orders.filter((order) => order.userId === userId);
      resolve(userOrders);
    }, 500);
  });
}
