import { hashPassword } from "@/lib/security";
import type { User } from "@/models/user.model";
import * as userRepository from "@/repositories/user.repository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getOrCreateUser, updateUser } from "./user.service";

// Mock dependencies
vi.mock("@/repositories/user.repository");
vi.mock("@/lib/security");
vi.mock("@/session.server");

// Define minimal SessionData and SessionFlashData types for testing
type SessionData = {
  userId?: number;
  [key: string]: any;
};

type SessionFlashData = {
  error: string;
};

// Test helpers
/**
 * Creates a mock session with the provided data
 * @param data Optional session data
 * @returns Mock session with all necessary methods
 */
function createMockSession(data: Partial<SessionData> = {}) {
  return {
    id: "test-session",
    data,
    get: vi.fn(<K extends keyof SessionData>(key: K) => data[key]),
    set: vi.fn(),
    unset: vi.fn(),
    has: vi.fn(),
    flash: vi.fn(
      <Key extends "error">(name: Key, value: SessionFlashData[Key]) => {}
    ),
  };
}

/**
 * Creates a mock request with a specific cookie
 * @param cookie Cookie value
 */
function createMockRequest(cookie = "mock-cookie"): Request {
  return {
    headers: { get: vi.fn(() => cookie) },
  } as unknown as Request;
}

/**
 * Creates a mock authenticated session
 * @param userId User ID
 */
function createMockAuthenticatedSession(userId: number = 1) {
  return createMockSession({ userId });
}

// Mock user data
const mockUser: User = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  password: "hashed-password",
  isGuest: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Crea un usuario mock de tipo invitado
 * @param baseUser Usuario base para crear el invitado
 */
function createMockGuestUser(baseUser: User = mockUser): User {
  return {
    ...baseUser,
    id: 2,
    isGuest: true,
    password: null,
    name: null,
  };
}

describe("User Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateUser", () => {
    it("should throw an error if the user is not authenticated", async () => {
      // Step 1: Setup mocks
      // Preparamos una sesión sin userId y el mock de getSession
      // para simular un escenario donde el usuario no está autenticado
      const { getSession } = await import("@/session.server");
      const mockSession = createMockSession();
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Step 2: Execute and verify
      // Intentamos actualizar un usuario sin autenticación
      // Esto debería lanzar un error específico
      await expect(updateUser({}, createMockRequest())).rejects.toThrow(
        "User not authenticated"
      );

      // Step 3: Verify mock calls
      // Comprobamos que se llamó a getSession con la cookie correcta
      // y que se intentó obtener el userId de la sesión
      expect(getSession).toHaveBeenCalledWith("mock-cookie");
      expect(mockSession.get).toHaveBeenCalledWith("userId");
    });

    it("should hash the password if updatedUser contains a password", async () => {
      // Step 1: Setup mocks
      // Preparamos una sesión autenticada y los mocks necesarios
      const { getSession } = await import("@/session.server");
      const mockSession = createMockAuthenticatedSession();
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Configuramos el hash esperado y el mock del repositorio
      const expectedHash = "hashed-new-password";
      vi.mocked(hashPassword).mockResolvedValue(expectedHash);
      vi.mocked(userRepository.updateUser).mockResolvedValue({
        ...mockUser,
        password: expectedHash,
      });

      // Step 2: Execute
      // Actualizamos la contraseña de un usuario autenticado
      const result = await updateUser(
        { password: "new-password" },
        createMockRequest()
      );

      // Step 3: Verify
      // Verificamos que:
      // 1. Se llamó a hashPassword con la contraseña original
      // 2. Se llamó al repositorio con el ID y la contraseña hasheada
      // 3. La respuesta del repositorio coincide con la esperada
      expect(hashPassword).toHaveBeenCalledWith("new-password");
      expect(userRepository.updateUser).toHaveBeenCalledWith(1, {
        password: expectedHash,
      });
      expect(result).toEqual({
        ...mockUser,
        password: expectedHash,
      });
    });
  });

  describe("getOrCreateUser", () => {
    it("should return an existing user if the email is already registered", async () => {
      // Step 1: Setup
      // Simulamos que existe un usuario con el email proporcionado
      vi.mocked(userRepository.getUserByEmail).mockResolvedValue(mockUser);

      // Step 2: Execute
      // Intentamos obtener el usuario existente
      const result = await getOrCreateUser("test@example.com");

      // Step 3: Verify
      // Verificamos que se buscó el usuario correcto y no se creó uno nuevo
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(userRepository.createUser).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should create a new guest user if the email is not registered", async () => {
      // Step 1: Setup
      // Simulamos que el usuario no existe y preparamos el nuevo usuario
      vi.mocked(userRepository.getUserByEmail).mockResolvedValue(null);
      const newUser = createMockGuestUser();
      vi.mocked(userRepository.createUser).mockResolvedValue(newUser);

      // Step 2: Execute
      // Intentamos crear un nuevo usuario invitado
      const result = await getOrCreateUser("new@example.com");

      // Step 3: Verify
      // Verificamos que se creó un nuevo usuario invitado con los datos correctos
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        "new@example.com"
      );
      expect(userRepository.createUser).toHaveBeenCalledWith({
        email: "new@example.com",
        password: null,
        isGuest: true,
        name: null,
      });
      expect(result).toEqual(newUser);
    });
  });
});
