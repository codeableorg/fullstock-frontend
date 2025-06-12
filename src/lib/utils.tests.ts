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
