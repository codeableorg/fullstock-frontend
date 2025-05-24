import { redirect } from "react-router";

import { serverClient } from "@/lib/client.server";
import { type AuthResponse } from "@/models/user.model";
import { getUserById } from "@/repositories/user.repository";
import { getSession } from "@/session.server";

// Recibir el `request` como argumento en las funciones que lo requieran

export async function getCurrentUser(
  request: Request
): Promise<AuthResponse["user"] | null> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const userId = session.get("userId");

  if (!userId) return null;

  try {
    return await getUserById(userId);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function login(
  request: Request,
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await serverClient<AuthResponse>("/auth/login", request, {
    body: { email, password },
  });
  return data;
}

export async function signup(
  request: Request,
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await serverClient<AuthResponse>("/auth/signup", request, {
    body: { email, password },
  });

  return data;
}

export async function requireUser(
  request: Request,
  redirectTo: string = "/login"
): Promise<AuthResponse["user"]> {
  const user = await getCurrentUser(request);

  if (!user) {
    throw redirect(redirectTo);
  }

  return user;
}

export async function redirectIfAuthenticated(
  request: Request,
  redirectTo: string = "/"
): Promise<null> {
  const user = await getCurrentUser(request);

  if (user) {
    throw redirect(redirectTo);
  }

  return null;
}
