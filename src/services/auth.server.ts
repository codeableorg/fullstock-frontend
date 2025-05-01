import { client, getToken, removeToken, setToken } from "@/lib/utils";
import { type AuthResponse } from "@/models/user.model";

// Recibir el `request` como argumento en las funciones que lo requieran

export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  // Obtener el token desde las cookies
  const token = getToken();
  if (!token) return null;

  try {
    // usar clientServer en vez de client
    return client<AuthResponse["user"]>("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    // Dejar que el caller maneje la eliminación del token (solo retornar null)
    removeToken();
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse["user"]> {
  // Usar clientServer en vez de client
  const data = await client<AuthResponse>("/auth/login", {
    body: { email, password },
  });

  // Dejar que el caller maneje el seteo del token en la session
  setToken(data.token);
  // retornar toda la data (user y token)
  return data.user;
}

export async function signup(
  email: string,
  password: string
): Promise<AuthResponse["user"]> {
  // Usar clientServer en vez de client
  const data = await client<AuthResponse>("/auth/signup", {
    body: { email, password },
  });

  // Dejar que el caller maneje el seteo del token en la session
  setToken(data.token);
  // retornar toda la data (user y token)
  return data.user;
}

// Evaluar si es necesario...
export function logout(): void {
  removeToken();
}

export async function requireUser(
  request: Request,
  redirectTo: string = "/login"
): Promise<AuthResponse["user"]> {
  // Obtener el usuario usando `getCurrentUser`
  // Si no hay usuario, lanzar (throw) un `redirect` hacia la ruta `redirectTo`
  // Caso contrario, retornar el usuario
}

export async function redirectIfAuthenticated(
  request: Request,
  redirectTo: string = "/"
): Promise<null> {
  // Obtener el usuario usando getCurrentUser
  // Si el usuario existe, lanzar (throw) un `redirect` hacia la ruta `redirectTo`
  // Caso contrario, retornar null
}
