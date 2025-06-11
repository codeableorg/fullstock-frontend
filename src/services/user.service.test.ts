import { describe, expect, it, vi } from "vitest";

import { hashPassword } from "@/lib/security";
import type { User } from "@/models/user.model";
import * as userRepository from "@/repositories/user.repository";
import { getSession } from "@/session.server";

import * as userService from "./user.service";

import type { Session } from "react-router";

// Helper functions for creating commonly used test objects
const createTestUser = (overrides?: Partial<User>): User => ({
  id: 1,
  email: "",
  name: null,
  password: null,
  isGuest: false,
  createdAt: "",
  updatedAt: "",
  ...overrides,
});

const createTestRequest = () =>
  new Request("http://localhost/test", {
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

// Mocking dependencies for unit tests
vi.mock("@/session.server");
vi.mock("@/repositories/user.repository");
vi.mock("@/lib/security");

describe("user service", () => {
  describe("updateUser", () => {
    it("should update user details", async () => {
      // Setup - Create mocks (test data)
      const updatedUser = createTestUser();
      const request = createTestRequest();
      const mockSession = createMockSession(updatedUser.id); // Simulate updated user ID in session

      // Mockeando las funciones que serán llamadas
      vi.mocked(userRepository.updateUser).mockResolvedValue(updatedUser);
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Llamando al servicio y verificando el resultado
      expect(await userService.updateUser(updatedUser, request)).toEqual(
        updatedUser
      );
    });

    it("should hash password if provided", async () => {
      // Setup - Create mocks (test data)
      const passwordBeforeHashing = "testing123";
      const updatedUser = createTestUser({
        id: 6,
        password: passwordBeforeHashing,
      });
      const request = createTestRequest();
      const mockSession = createMockSession(updatedUser.id); // Simulate updated user ID in session

      // Mockeando las funciones que serán llamadas
      vi.mocked(getSession).mockResolvedValue(mockSession);
      vi.mocked(hashPassword).mockResolvedValue("hashed-password");

      // Llamando al servicio y verificando el resultado
      await userService.updateUser(updatedUser, request);

      expect(hashPassword).toHaveBeenCalledWith(passwordBeforeHashing); // Verifica que se haya llamado a hashPassword con la contraseña original
      expect(updatedUser.password).not.toBe(passwordBeforeHashing); // Verifica que la contraseña se haya actualizado
      expect(updatedUser.password).toBe("hashed-password"); // Verifica que la contraseña se haya actualizado
    });

    it("should throw error if user is not authenticated", async () => {
      // Setup - Create mocks (test data)
      const updatedUser = createTestUser(); // No user ID provided
      const request = createTestRequest();
      const mockSession = createMockSession(null); // Simulate no user ID in session

      // Mockeando las funciones que serán llamadas
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Llamando al servicio y verificando el resultado
      await expect(
        userService.updateUser(updatedUser, request)
      ).rejects.toThrow("User not authenticated");

      expect(getSession).toHaveBeenCalledWith("session=mock-session-id");
    });
  });
});
