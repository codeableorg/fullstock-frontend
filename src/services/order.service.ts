import { client } from "@/lib/utils";
import { type CartItemInput } from "@/models/cart.model";
import { type Order, type OrderDetails } from "@/models/order.model";

export async function createOrder(
  items: CartItemInput[],
  formData: Record<string, unknown>
): Promise<{ orderId: string }> {
  const shippingDetails = formData as unknown as OrderDetails;
  const data = await client<{ id: string }>(`/orders`, {
    body: { items, shippingDetails },
  });

  return { orderId: data.id };
}

export async function getOrdersByUser(): Promise<Order[]> {
  const orders = await client<Order[]>(`/orders`);
  return orders.map((order) => ({
    ...order,
    createdAt: new Date(order.createdAt),
  }));
}
