import { redirect } from "react-router";

import { serverClient } from "@/lib/client.server";
import { type AuthResponse } from "@/models/user.model";
import { getSession } from "@/session.server";

export async function getCurrentUser(
  request: Request
): Promise<AuthResponse["user"] | null> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");

  if (!token) return null;

  let endpoint = `/users/me`;

  try {
    return serverClient<AuthResponse["user"]>(endpoint, token);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function login(
  request: Request,
  email: string,
  password: string,
  cartSessionId: number | undefined
): Promise<AuthResponse> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");
  let endpoint = "/auth/login";

  const data = await serverClient<AuthResponse>(endpoint, token, {
    body: { email, password, cartSessionId },
  });
  return data;
}

export async function signup(
  request: Request,
  email: string,
  password: string
): Promise<AuthResponse> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");
  let endpoint = "/auth/signup";

  const data = await serverClient<AuthResponse>(endpoint, token, {
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
