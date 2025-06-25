import { Decimal } from "@prisma/client/runtime/library";
import { type Category, type Product } from "generated/prisma/client.js";
import { vi } from "vitest";

import type { User } from "@/models/user.model";

import type { Session } from "react-router";

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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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

export const createTestProduct = (overrides?: Partial<Product>): Product => ({
  id: 1,
  title: "Test Product",
  imgSrc: "/test-image.jpg",
  alt: "Test alt text",
  price: new Decimal("100"),
  description: "Test description",
  categoryId: 1,
  isOnSale: false,
  features: ["Feature 1", "Feature 2"],
  createdAt: new Date(),
  updatedAt: new Date(),
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
