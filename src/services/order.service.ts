import { CartItem } from "@/models/cart.model";
import { Order, OrderDetails } from "@/models/order.model";
import { findOrCreateGuestUser } from "./user.service";
import { API_URL } from "@/config";
import { isApiError } from "@/models/error.model";
import { getToken } from "./auth.service";

export async function createOrder(
  items: CartItem[],
  formData: FormData
): Promise<{ orderId: string }> {

  const shippingDetails = Object.fromEntries(formData) as unknown as OrderDetails;

  try {

    await findOrCreateGuestUser(shippingDetails.email);

    const token = getToken();

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items, shippingDetails }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return { orderId: data.id };

  } catch (error) {
    console.error(error);
    throw error;
  }

}

export async function getOrdersByUser(): Promise<Order[]> {

  try {

    const token = getToken();

    const response = await fetch(`${API_URL}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data = await response.json();
    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }

}
