import { prisma } from "@/db/prisma";
import { calculateTotal } from "@/lib/cart";
import { type CartItemInput } from "@/models/cart.model";
import { type Order, type OrderDetails } from "@/models/order.model";
import { getSession } from "@/session.server";

import { getOrCreateUser } from "./user.service";

export async function createOrder(
  items: CartItemInput[],
  formData: OrderDetails,
  paymentId: string
): Promise<Order> {
  const shippingDetails = formData;
  const user = await getOrCreateUser(shippingDetails.email);
  const totalAmount = calculateTotal(items);

  let order;

  try {
    order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: totalAmount,
        ...shippingDetails,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            categoryVariantId: item.categoryVariantId,
            quantity: item.quantity,
            title: item.title,
            variantInfo: item.variantInfo,
            price: item.price,
            imgSrc: item.imgSrc,
          })),
        },
        paymentId: paymentId,
      },
      include: {
        items: true,
      },
    });
  } catch (error) {
    throw new Error("Failed to create order", { cause: error });
  }

  const details = {
    email: order.email,
    firstName: order.firstName,
    lastName: order.lastName,
    company: order.company,
    address: order.address,
    city: order.city,
    country: order.country,
    region: order.region,
    zip: order.zip,
    phone: order.phone,
  };
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      imgSrc: item.imgSrc,
      productId: item.productId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    details,
    ...details,
  };
}

export async function getOrdersByUser(request: Request): Promise<Order[]> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders.map((order) => {
    const details = {
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
      company: order.company,
      address: order.address,
      city: order.city,
      country: order.country,
      region: order.region,
      zip: order.zip,
      phone: order.phone,
    };
    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      details,
      ...details,
    };
  });
}
