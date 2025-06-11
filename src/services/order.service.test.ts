import { describe, expect, it, vi } from "vitest";

import { calculateTotal } from "@/lib/cart";
import type { CartItemInput } from "@/models/cart.model";
import type { Order, OrderDetails, OrderItem } from "@/models/order.model";
import type { User } from "@/models/user.model";
import * as orderRepository from "@/repositories/order.repository";
import { getSession } from "@/session.server";

import { createOrder, getOrdersByUser } from "./order.service";
import { getOrCreateUser } from "./user.service";

import type { Session } from "react-router";

vi.mock("./user.service");
vi.mock("@/lib/cart");
vi.mock("@/repositories/order.repository");
vi.mock("@/session.server");

describe("Order Service", () => {
  const mockedItems: CartItemInput[] = [
    {
      productId: 1,
      quantity: 2,
      title: "Test Product",
      price: 19.99,
      imgSrc: "test-product.jpg",
    },
    {
      productId: 2,
      quantity: 1,
      title: "Another Product",
      price: 29.99,
      imgSrc: "another-product.jpg",
    },
  ];

  const mockedFormData: OrderDetails = {
    email: "test@test.com",
    firstName: "",
    lastName: "",
    company: null,
    address: "",
    city: "",
    country: "",
    region: "",
    zip: "",
    phone: "",
  };

  const mockedUser: User = {
    createdAt: "",
    email: "",
    id: 1,
    isGuest: false,
    name: "",
    updatedAt: "",
    password: "",
  };

  const mockedOrder: Order = {
    createdAt: "",
    id: 1,
    items: [
      {
        ...mockedItems[0],
        id: 2,
        orderId: 2,
        createdAt: "",
        updatedAt: "",
      },
      {
        ...mockedItems[1],
        id: 1,
        orderId: 1,
        createdAt: "",
        updatedAt: "",
      },
    ],
    totalAmount: 200,
    userId: 1,
    updatedAt: "",
    details: mockedFormData,
  };

  const mockedTotalAmount = 200;

  const mockedRequest = new Request("http://localhost/test", {
    headers: { Cookie: "session=mock-session-id" },
  });

  const createMockSession = (userId: number | null): Session => ({
    id: "mock-session-id",
    data: {},
    has: vi.fn(),
    get: vi.fn().mockReturnValue(userId), // Default userId in session
    set: vi.fn(),
    flash: vi.fn(),
    unset: vi.fn(),
  });

  it("should create an order", async () => {
    vi.mocked(getOrCreateUser).mockResolvedValue(mockedUser);
    vi.mocked(calculateTotal).mockReturnValue(mockedTotalAmount);
    vi.mocked(orderRepository.createOrderWithItems).mockResolvedValue(
      mockedOrder
    );

    const order = await createOrder(mockedItems, mockedFormData);

    expect(orderRepository.createOrderWithItems).toBeCalledWith(
      mockedUser.id,
      mockedItems,
      mockedFormData,
      mockedTotalAmount
    );
    expect(order).toEqual(mockedOrder);
  });

  it("should get orders by user", async () => {
    const mockedOrders = [mockedOrder, { ...mockedOrder, id: 3 }];
    const mockedSession = createMockSession(mockedUser.id); // Simulate updated user ID in session

    vi.mocked(getSession).mockResolvedValue(mockedSession);
    vi.mocked(orderRepository.getOrdersByUserId).mockResolvedValue(
      mockedOrders
    );

    const orders = await getOrdersByUser(mockedRequest);

    expect(orderRepository.getOrdersByUserId).toBeCalledWith(mockedUser.id);
    expect(orders).toEqual(mockedOrders);
  });

  it("should throw error if user is not authenticated", async () => {
    const mockedSession = createMockSession(null); // Simulate updated user ID in session

    vi.mocked(getSession).mockResolvedValue(mockedSession);

    await expect(getOrdersByUser(mockedRequest)).rejects.toThrow(
      "User not authenticated"
    );

    expect(getSession).toHaveBeenCalledWith("session=mock-session-id");
  });

  it("should throw error if order is null", async () => {
    vi.mocked(getOrCreateUser).mockResolvedValue(mockedUser);
    vi.mocked(calculateTotal).mockReturnValue(mockedTotalAmount);
    vi.mocked(orderRepository.createOrderWithItems).mockResolvedValue(null);

    await expect(createOrder(mockedItems, mockedFormData)).rejects.toThrow(
      "Failed to create order"
    );

    expect(orderRepository.createOrderWithItems).toBeCalledWith(
      mockedUser.id,
      mockedItems,
      mockedFormData,
      mockedTotalAmount
    );
  });
});
