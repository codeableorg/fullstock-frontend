import { describe, expect, it, vi } from "vitest";

import type { User } from "@/models/user.model";
import * as userRepository from "@/repositories/user.repository";
import { getSession } from "@/session.server";

import * as userService from "./user.service";

import { hashPassword } from "@/lib/security";
import type { Session } from "react-router";

vi.mock("@/session.server");
vi.mock("@/repositories/user.repository");
vi.mock("@/lib/security");

describe("user service", () => {
  describe("updateUser", () => {
    it("should update user details", async () => {
      // Creando mocks
      const updatedUser: User = {
        id: 1,
        email: "",
        name: null,
        password: null,
        isGuest: false,
        createdAt: "",
        updatedAt: "",
      };

      const request = new Request("http://localhost/test", {
        headers: {
          Cookie: "session=mock-session-id",
        },
      });

      const mockSession: Session = {
        id: "mock-session-id",
        data: {},
        has: vi.fn(),
        get: vi.fn().mockReturnValue(1), // Simulate no userId in session
        set: vi.fn(),
        flash: vi.fn(),
        unset: vi.fn(),
      };

      // Mockeando las funciones que serán llamadas
      vi.mocked(userRepository.updateUser).mockResolvedValue(updatedUser);
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Llamando al servicio y verificando el resultado
      expect(await userService.updateUser(updatedUser, request)).toEqual(
        updatedUser
      );
    });

    it("should hash password if provided", async () => {
      // Test implementation for hashing password
      // Creando mocks

      const passwordBeforeHashing = "testing123";

      const updatedUser: Partial<User> = {
        id: 6,
        password: passwordBeforeHashing,
      };

      const request = new Request("http://localhost/test", {
        headers: {
          Cookie: "session=mock-session-id",
        },
      });

      const mockSession: Session = {
        id: "mock-session-id",
        data: {},
        has: vi.fn(),
        get: vi.fn().mockReturnValue(updatedUser.id), // Simulate userId in session
        set: vi.fn(),
        flash: vi.fn(),
        unset: vi.fn(),
      };

      // Mockeando las funciones que serán llamadas
      // vi.mocked(hashPassword).mockResolvedValue(mockHashPassword);
      vi.mocked(getSession).mockResolvedValue(mockSession);
      // vi.mocked(userRepository.updateUser).mockResolvedValue({
      //   ...updatedUser,
      //   password: mockHashPassword,
      // });

      // Llamando al servicio y verificando el resultado
      await userService.updateUser(updatedUser, request);
      expect(hashPassword).toHaveBeenCalledWith(passwordBeforeHashing);
      expect(updatedUser.password).not.toBe(passwordBeforeHashing);
    });

    it("should throw error if user is not authenticated", async () => {
      // Creando mocks
      const updatedUser = {};
      const request = new Request("http://localhost/test", {
        headers: {
          Cookie: "session=mock-session-id",
        },
      });

      const mockSession: Session = {
        id: "mock-session-id",
        data: {},
        has: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
        flash: vi.fn(),
        unset: vi.fn(),
      };

      // Mockeando las funciones que serán llamadas
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Verificando el resultado
      await expect(
        userService.updateUser(updatedUser, request)
      ).rejects.toThrow("User not authenticated");
      expect(getSession).toHaveBeenCalledWith("session=mock-session-id");
    });
  });
});
