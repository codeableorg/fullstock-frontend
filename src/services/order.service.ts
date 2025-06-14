import { calculateTotal } from "@/lib/cart";
import { type CartItemInput } from "@/models/cart.model";
import { type Order, type OrderDetails } from "@/models/order.model";
import * as orderRepository from "@/repositories/order.repository";
import { getSession } from "@/session.server";

import { getOrCreateUser } from "./user.service";

export async function createOrder(
  items: CartItemInput[],
  formData: OrderDetails
): Promise<Order> {
  const shippingDetails = formData;

  const user = await getOrCreateUser(shippingDetails.email);
  const totalAmount = calculateTotal(items);

  const order = await orderRepository.createOrderWithItems(
    user.id,
    items,
    shippingDetails,
    totalAmount
  );

  if (!order) throw new Error("Failed to create order");

  return order;
}

export async function getOrdersByUser(request: Request): Promise<Order[]> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const orders = await orderRepository.getOrdersByUserId(userId);

  return orders;
}
