import { client } from "@/lib/utils";
import { CartItemInput } from "@/models/cart.model";
import { Order, OrderDetails } from "@/models/order.model";

export async function createOrder(
  items: CartItemInput[],
  formData: FormData
): Promise<{ orderId: string }> {
  const shippingDetails = Object.fromEntries(
    formData
  ) as unknown as OrderDetails;

  const data = await client<{ id: string }>(`/orders`, {
    body: { items, shippingDetails },
  });

  return { orderId: data.id };
}

export async function getOrdersByUser(): Promise<Order[]> {
  return client<Order[]>(`/orders`);
}
