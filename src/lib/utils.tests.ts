import { vi } from "vitest";

import type { Category } from "@/models/category.model";
import type { Order, OrderDetails, OrderItem } from "@/models/order.model";
import type { ProductVariantValue } from "@/models/product.model";
import type { User } from "@/models/user.model";

import type {
  OrderItem as PrismaOrderItem,
  Order as PrismaOrder,
  Product as PrismaProduct,
  VariantAttributeValue as PrismaVariantAttributeValue,

} from "@/../generated/prisma/client";
import type { Session } from "react-router";

import { Decimal } from "@/../generated/prisma/internal/prismaNamespace";

type TestRequestConfig = {
  url?: string;
  headers?: HeadersInit;
};

// Helper functions for creating commonly used test objects
export const createTestUser = (overrides?: Partial<User>): User => ({
  id: 1,
  email: "",
  name: null,
  password: null,
  isGuest: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestRequest = (overrides?: TestRequestConfig): Request => {
  const defaultConfig: TestRequestConfig = {
    url: "http://localhost/test",
    headers: { Cookie: "session=mock-session-id" },
  };

  const config = { ...defaultConfig, ...overrides };
  return new Request(config.url!, {
    headers: { ...defaultConfig.headers, ...config.headers },
  });
};

export const createMockSession = (userId: number | null): Session => ({
  id: "mock-session-id",
  data: {},
  has: vi.fn(),
  get: vi.fn().mockReturnValue(userId), // Default userId in session
  set: vi.fn(),
  flash: vi.fn(),
  unset: vi.fn(),
});

export const createTestDBProduct = (
  overrides?: Partial<PrismaProduct> & { variantAttributeValues?: PrismaVariantAttributeValue[] }
): PrismaProduct & { variantAttributeValues: PrismaVariantAttributeValue[] } => ({
  id: 1,
  title: "Test Product",
  imgSrc: "/test-image.jpg",
  alt: "Test alt text",
  description: "Test description",
  categoryId: 1,
  isOnSale: false,
  features: ["Feature 1", "Feature 2"],
  createdAt: new Date(),
  updatedAt: new Date(),
  variantAttributeValues: overrides?.variantAttributeValues ?? [createTestDBVariantAttributeValue()],
  ...overrides,
});

// --- FRONTEND PRODUCT ---
export const createTestProduct = (overrides?: Partial<ProductVariantValue>): ProductVariantValue => ({
  id: 1,
  title: "Test Product",
  imgSrc: "/test-image.jpg",
  alt: "Test alt text",
  description: "Test description",
  categoryId: 1,
  isOnSale: false,
  features: ["Feature 1", "Feature 2"],
  createdAt: new Date(),
  updatedAt: new Date(),
  variantAttributeValues: [createTestDBVariantAttributeValue()],
  ...overrides,
});


export const createTestCategory = (
  overrides?: Partial<Category>
): Category => ({
  id: 1,
  title: "Polos",
  slug: "polos",
  imgSrc: "/images/polos.jpg",
  alt: "Colección de polos para programadores",
  description: "Explora nuestra colección de polos para programadores",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestDBVariantAttributeValue = (
  overrides?: Partial<PrismaVariantAttributeValue>
): PrismaVariantAttributeValue => ({
  id: 1,
  attributeId: 1,
  productId: 1,
  value: "Default",
  price: new Decimal(100),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestOrderDetails = (
  overrides: Partial<OrderDetails> = {}
): OrderDetails => ({
  email: "test@test.com",
  firstName: "Test",
  lastName: "User",
  company: null,
  address: "Test Address",
  city: "Test City",
  country: "Test Country",
  region: "Test Region",
  zip: "12345",
  phone: "123456789",
  ...overrides,
});

export const createTestOrderItem = (
  overrides: Partial<OrderItem> = {}
): OrderItem =>
  ({
    id: 1,
    orderId: 1,
    productId: 1,
    quantity: 1,
    title: "Test Product",
    price: 100,
    imgSrc: "test-image.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } satisfies OrderItem);

export const createTestDBOrderItem = (
  overrides: Partial<PrismaOrderItem> = {}
): PrismaOrderItem =>
  ({
    id: 1,
    orderId: 1,
    productId: 1,
    quantity: 1,
    title: "Test Product",
    price: new Decimal(100),
    imgSrc: "test-image.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } satisfies PrismaOrderItem);

export const createTestOrder = (overrides: Partial<Order> = {}): Order => {
  const details = overrides.details ?? createTestOrderDetails();
  return {
    id: 1,
    userId: 1,
    totalAmount: 100,
    items: [createTestOrderItem()],
    details,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...details, // Expande todos los campos de contacto sin undefined
    paymentId: `payment-id-${Math.random()}`,
    ...overrides,
  } satisfies Order;
};

export const createTestDBOrder = (
  overrides: Partial<PrismaOrder> = {}
): PrismaOrder => {
  return {
    id: 1,
    userId: 1,
    email: "test@mail.com",
    totalAmount: new Decimal(100),
    firstName: "Test",
    lastName: "User",
    company: null,
    address: "Test Address",
    city: "Test City",
    country: "Test Country",
    region: "Test Region",
    zip: "12345",
    phone: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentId: `payment-id-${Math.random()}`,
    ...overrides,
  } satisfies PrismaOrder;
};
