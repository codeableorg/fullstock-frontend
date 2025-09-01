import { Decimal } from "@prisma/client/runtime/library";
import { describe, expect, it, vi, beforeEach } from "vitest";

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
import type { CartItemWithProduct } from "@/models/cart.model";
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockedItems: CartItemWithProduct[] = [
    {
      product: {
        id: 1,
        title: "Test Product",
        price: 19.99,
        imgSrc: "test-product.jpg",
        alt: "Test Product Alt",
        isOnSale: false,
      },
      quantity: 2,
      attributeValueId: 1,
    },
    {
      product: {
        id: 2,
        title: "Another Product",
        price: 29.99,
        imgSrc: "another-product.jpg",
        alt: "Another Product Alt",
        isOnSale: true,
      },
      quantity: 1,
      attributeValueId: 2,
    },
  ];

  const mockedFormData = createTestOrderDetails();
  const mockedUser = createTestUser();
  const mockedTotalAmount = 200;
  const mockedRequest = createTestRequest();

  describe("createOrder", () => {
    it("should create an order successfully", async () => {
      const prismaOrder = {
        ...createTestDBOrder(),
        items: [
          {
            ...createTestDBOrderItem(),
            variantAttributeValue: {
              id: 1,
              value: "Test Value",
              price: 19.99,
              product: {
                id: 1,
                title: "Test Product",
                imgSrc: "test-product.jpg",
                alt: "Test Product Alt",
                isOnSale: false,
              },
            },
          },
        ],
      };

      vi.mocked(getOrCreateUser).mockResolvedValue(mockedUser);
      vi.mocked(calculateTotal).mockReturnValue(mockedTotalAmount);
      vi.mocked(mockPrisma.order.create).mockResolvedValue(prismaOrder);

      const order = await createOrder(mockedItems, mockedFormData, "payment-id");

      expect(getOrCreateUser).toHaveBeenCalledWith(mockedFormData.email);
      expect(calculateTotal).toHaveBeenCalledWith(mockedItems);
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
              attributeValueId: item.attributeValueId,
              quantity: item.quantity,
              title: item.product.title,
              price: item.product.price ?? 0,
              imgSrc: item.product.imgSrc ?? "",
            })),
          },
          paymentId: "payment-id",
        },
        include: {
          items: {
            include: {
              variantAttributeValue: {
                include: {
                  product: {
                    select: {
                      id: true,
                      title: true,
                      imgSrc: true,
                      alt: true,
                      isOnSale: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      expect(order).toEqual({
        ...prismaOrder,
        totalAmount: Number(prismaOrder.totalAmount),
        items: prismaOrder.items.map((item) => ({
          ...item,
          price: Number(item.price),
          variantAttributeValue: item.variantAttributeValue,
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
        paymentId: prismaOrder.paymentId,
      });
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

    it("should handle empty items array", async () => {
      vi.mocked(getOrCreateUser).mockResolvedValue(mockedUser);
      vi.mocked(calculateTotal).mockReturnValue(0);

      const prismaOrder = {
        ...createTestDBOrder({ totalAmount: new Decimal(0) }),
        items: [],
      };

      vi.mocked(mockPrisma.order.create).mockResolvedValue(prismaOrder);

      const order = await createOrder([], mockedFormData, "payment-id");

      expect(order.items).toEqual([]);
      expect(order.totalAmount).toBe(0);
    });
  });

  describe("getOrdersByUser", () => {
    it("should get orders by user successfully", async () => {
      const prismaOrders = [
        {
          ...createTestDBOrder(),
          items: [
            {
              ...createTestOrderItem(),
              variantAttributeValue: {
                id: 1,
                value: "Test Value",
                price: 19.99,
                product: {
                  id: 1,
                  title: "Test Product",
                  imgSrc: "test-product.jpg",
                  alt: "Test Product Alt",
                  isOnSale: false,
                },
              },
            },
          ],
        },
        {
          ...createTestDBOrder({ id: 2 }),
          items: [
            {
              ...createTestOrderItem({ id: 2 }),
              variantAttributeValue: {
                id: 2,
                value: "Test Value 2",
                price: 29.99,
                product: {
                  id: 2,
                  title: "Another Product",
                  imgSrc: "another-product.jpg",
                  alt: "Another Product Alt",
                  isOnSale: true,
                },
              },
            },
          ],
        },
      ];
      const mockedSession = createMockSession(mockedUser.id);

      vi.mocked(getSession).mockResolvedValue(mockedSession);
      vi.mocked(mockPrisma.order.findMany).mockResolvedValue(prismaOrders);

      const orders = await getOrdersByUser(mockedRequest);

      expect(getSession).toHaveBeenCalledWith("session=mock-session-id");
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: mockedUser.id },
        include: {
          items: {
            include: {
              variantAttributeValue: {
                include: {
                  product: {
                    select: {
                      id: true,
                      title: true,
                      imgSrc: true,
                      alt: true,
                      isOnSale: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      expect(orders).toEqual(
        prismaOrders.map((order) => ({
          ...order,
          totalAmount: Number(order.totalAmount),
          items: order.items.map((item) => ({
            ...item,
            price: Number(item.price),
            variantAttributeValue: item.variantAttributeValue,
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
      expect(mockPrisma.order.findMany).not.toHaveBeenCalled();
    });

    it("should return empty array if user has no orders", async () => {
      const mockedSession = createMockSession(mockedUser.id);

      vi.mocked(getSession).mockResolvedValue(mockedSession);
      vi.mocked(mockPrisma.order.findMany).mockResolvedValue([]);

      const orders = await getOrdersByUser(mockedRequest);

      expect(orders).toEqual([]);
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: mockedUser.id },
        include: {
          items: {
            include: {
              variantAttributeValue: {
                include: {
                  product: {
                    select: {
                      id: true,
                      title: true,
                      imgSrc: true,
                      alt: true,
                      isOnSale: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should handle database errors gracefully", async () => {
      const mockedSession = createMockSession(mockedUser.id);

      vi.mocked(getSession).mockResolvedValue(mockedSession);
      vi.mocked(mockPrisma.order.findMany).mockRejectedValue(
        new Error("Database connection error")
      );

      await expect(getOrdersByUser(mockedRequest)).rejects.toThrow(
        "Failed to fetch orders"
      );
    });
  });
});