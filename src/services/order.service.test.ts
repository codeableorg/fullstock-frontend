import { describe, expect, it, vi } from "vitest";

import { prisma as mockPrisma } from "@/db/prisma";
import { calculateTotal } from "@/lib/cart";
import {
  createMockSession,
  createTestDBOrder,
  createTestDBOrderItem,
  createTestOrderDetails,
  createTestOrderItem,
  createTestRequest,
  createTestUser,
} from "@/lib/utils.tests";
import type { CartItemInput } from "@/models/cart.model";
import { getSession } from "@/session.server";

import { createOrder, getOrdersByUser } from "./order.service";
import { getOrCreateUser } from "./user.service";

vi.mock("@/db/prisma", () => ({
  prisma: {
    order: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("./user.service");
vi.mock("@/lib/cart");
vi.mock("@/session.server");

describe("Order Service", () => {
  const mockedItems: CartItemInput[] = [
    {
      productId: 1,
      quantity: 2,
      title: "Test Product",
      price: 19.99,
      imgSrc: "test-product.jpg",
      categoryVariantId: 1,
      variantInfo: "Talla: S",
    },
    {
      productId: 2,
      quantity: 1,
      title: "Another Product",
      price: 29.99,
      imgSrc: "another-product.jpg",
      categoryVariantId: 2,
      variantInfo: "Talla: M",
    },
  ];

  const mockedFormData = createTestOrderDetails();
  const mockedUser = createTestUser();
  const mockedTotalAmount = 200;
  const mockedRequest = createTestRequest();

  it("should create an order", async () => {
    const prismaOrder = {
      ...createTestDBOrder(),
      items: [createTestDBOrderItem()],
    };

    vi.mocked(getOrCreateUser).mockResolvedValue(mockedUser);
    vi.mocked(calculateTotal).mockReturnValue(mockedTotalAmount);

    vi.mocked(mockPrisma.order.create).mockResolvedValue(prismaOrder);

    const order = await createOrder(mockedItems, mockedFormData, "payment-id");
    expect(mockPrisma.order.create).toHaveBeenCalledWith({
      data: {
        userId: mockedUser.id,
        totalAmount: mockedTotalAmount,
        email: mockedFormData.email,
        firstName: mockedFormData.firstName,
        lastName: mockedFormData.lastName,
        company: mockedFormData.company,
        address: mockedFormData.address,
        city: mockedFormData.city,
        country: mockedFormData.country,
        region: mockedFormData.region,
        zip: mockedFormData.zip,
        phone: mockedFormData.phone,
        items: {
          create: mockedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            title: item.title,
            price: item.price,
            imgSrc: item.imgSrc,
            categoryVariantId: item.categoryVariantId,
            variantInfo: item.variantInfo,
          })),
        },
        paymentId: "payment-id",
      },
      include: {
        items: true,
      },
    });
    expect(order).toEqual({
      ...prismaOrder,
      totalAmount: Number(prismaOrder.totalAmount),
      items: prismaOrder.items.map((item) => ({
        ...item,
        price: Number(item.price),
        imgSrc: item.imgSrc ?? "",
        productId: item.productId ?? 0,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
      details: {
        email: prismaOrder.email,
        firstName: prismaOrder.firstName,
        lastName: prismaOrder.lastName,
        company: prismaOrder.company,
        address: prismaOrder.address,
        city: prismaOrder.city,
        country: prismaOrder.country,
        region: prismaOrder.region,
        zip: prismaOrder.zip,
        phone: prismaOrder.phone,
      },
      paymentId: prismaOrder.paymentId,
    });
  });

  it("should get orders by user", async () => {
    const prismaOrders = [
      { ...createTestDBOrder(), items: [createTestOrderItem()] },
      {
        ...createTestDBOrder({ id: 2 }),
        items: [createTestOrderItem({ id: 2 })],
      },
    ];
    const mockedSession = createMockSession(mockedUser.id);
    vi.mocked(getSession).mockResolvedValue(mockedSession);
    vi.mocked(mockPrisma.order.findMany).mockResolvedValue(prismaOrders);
    const orders = await getOrdersByUser(mockedRequest);
    expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
      where: { userId: mockedUser.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    expect(orders).toEqual(
      prismaOrders.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          imgSrc: item.imgSrc ?? "",
          productId: item.productId ?? 0,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        details: {
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
        },
      }))
    );
  });

  it("should throw error if user is not authenticated", async () => {
    const mockedSession = createMockSession(null);

    vi.mocked(getSession).mockResolvedValue(mockedSession);

    await expect(getOrdersByUser(mockedRequest)).rejects.toThrow(
      "User not authenticated"
    );

    expect(getSession).toHaveBeenCalledWith("session=mock-session-id");
  });

  it("should throw error if order creation fails", async () => {
    vi.mocked(getOrCreateUser).mockResolvedValue(mockedUser);
    vi.mocked(calculateTotal).mockReturnValue(mockedTotalAmount);
    vi.mocked(mockPrisma.order.create).mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      createOrder(mockedItems, mockedFormData, "payment-id")
    ).rejects.toThrow("Failed to create order");

    expect(mockPrisma.order.create).toHaveBeenCalled();
  });
});
