import { client, getToken, removeToken, setToken } from "@/lib/utils";
import { AuthResponse } from "@/models/user.model";

export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  const token = getToken();
  if (!token) return null;

  try {
    return client<AuthResponse["user"]>("/users/me");
  } catch (error) {
    console.error("Error fetching current user:", error);
    removeToken();
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse["user"]> {
  const data = await client<AuthResponse>("/auth/login", {
    body: { email, password },
  });

  setToken(data.token);
  return data.user;
}

export async function signup(
  email: string,
  password: string
): Promise<AuthResponse["user"]> {
  const data = await client<AuthResponse>("/auth/signup", {
    body: { email, password },
  });

  setToken(data.token);
  return data.user;
}

export function logout(): void {
  removeToken();
}
