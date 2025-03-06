import { API_URL, TOKEN_KEY } from "@/config";
import { isApiError } from "@/models/error.model";
import { AuthResponse } from "@/models/user.model";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}


interface ClientOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown>; 
}

//Simplificar solicitudes
async function client<T>(endpoint: string, { body, ...customConfig }: ClientOptions = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    body: body ? JSON.stringify(body) : undefined, 
  };

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  try {
    return await client<AuthResponse["user"]>("users/me");
  } catch {
    return null;
  }
}


export async function login(email: string, password: string): Promise<AuthResponse["user"]> {
  try {
    const data = await client<AuthResponse>("auth/login", {
      method: "POST",
      body: { email, password }, 
    });

    setToken(data.token);
    return data.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function signup(email: string, password: string): Promise<AuthResponse["user"]> {
  try {
    const data = await client<AuthResponse>("auth/signup", {
      method: "POST",
      body: { email, password }, 
    });

    setToken(data.token);
    return data.user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}


