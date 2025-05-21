import { serverClient } from "@/lib/client.server";
import { type CartItemInput } from "@/models/cart.model";
import { type Order, type OrderDetails } from "@/models/order.model";

export async function createOrder(
  items: CartItemInput[],
  formData: Record<string, unknown>,
  request: Request
): Promise<{ orderId: string }> {
  const shippingDetails = formData as unknown as OrderDetails;
  const data = await serverClient<{ id: string }>(`/orders`, request, {
    body: { items, shippingDetails },
  });

  return { orderId: data.id };
}

export async function getOrdersByUser(request: Request): Promise<Order[]> {
  const orders = await serverClient<Order[]>(`/orders`, request);
  return orders.map((order) => ({
    ...order,
    createdAt: new Date(order.createdAt),
  }));
}
