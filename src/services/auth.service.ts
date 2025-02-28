import { API_URL, TOKEN_KEY } from "@/config";
import { isApiError } from "@/models/error.model";
import { AuthResponse } from "@/models/user.model";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  try {
    const token = getToken();
    if (!token) {
      return null;
    }

    const response = await fetch(API_URL + "/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as AuthResponse["user"];

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse["user"]> {
  try {
    const response = await fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json()) as AuthResponse;

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    setToken(data.token);

    return data.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function signup(
  email: string,
  password: string
): Promise<AuthResponse["user"]> {
  try {
    const response = await fetch(API_URL + "/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json()) as AuthResponse;

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    setToken(data.token);

    return data.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
