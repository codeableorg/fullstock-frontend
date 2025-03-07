import { API_URL } from "@/config";
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

  try {
    const data = await client<{ id: string }>(`${API_URL}/orders`, {
      body: { items, shippingDetails },
    });

    return { orderId: data.id };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOrdersByUser(): Promise<Order[]> {
  try {
    const data = await client<Order[]>(`${API_URL}/orders`);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
