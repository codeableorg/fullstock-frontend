import { beforeEach, describe, expect, it, vi } from "vitest";

import { hashPassword } from "@/lib/security";
import {
  createMockSession,
  createTestRequest,
  createTestUser,
} from "@/lib/utils.tests";
import { getSession } from "@/session.server";
import { prisma } from "@/db/prisma";
import type { User } from "generated/prisma/client";

import * as userService from "./user.service";

// Mocking dependencies for unit tests
vi.mock("@/session.server");
vi.mock("@/lib/security");
vi.mock("@/db/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("user service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateUser", () => {
    it("should update user details", async () => {
      // Setup - Create mocks (test data)
      const updatedUser = createTestUser();
      const request = createTestRequest();
      const mockSession = createMockSession(updatedUser.id); // Simulate updated user ID in session

      // Mockeando las funciones que serán llamadas
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser);
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
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...updatedUser,
        password: "hashed-password",
      });

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

  describe("getOrCreateUser", () => {
    it("should return existing user when email is found", async () => {
      // Setup - Create mock data
      const email = "test@example.com";
      const existingUser = createTestUser({
        email,
        id: 10,
      });

      // Mock repository function to return existing user
      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);

      // Call service function
      const result = await userService.getOrCreateUser(email);

      // Verify results
      expect(result).toEqual(existingUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("should create a new guest user when email is not found", async () => {
      // Setup - Create mock data
      const email = "test@example.com";
      const newUser = createTestUser({
        email,
        id: 20,
        isGuest: true,
      });
      // Mock repository functions
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(newUser);
      // Call service function
      const result = await userService.getOrCreateUser(email);
      // Verify results
      expect(result).toEqual(newUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email,
          password: null,
          isGuest: true,
          name: null,
        },
      });
    });
  });
});
