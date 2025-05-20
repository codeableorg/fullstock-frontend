import { client } from "@/lib/utils";
import { type AuthResponse, type User } from "@/models/user.model";

export async function findOrCreateGuestUser(email: string): Promise<void> {
  const body = await client<AuthResponse>("/auth/newOrExist", {
    body: { email },
  });

  if (body.token.length > 0) {
    // setToken(body.token);
  }
}

export async function findEmail(email: string): Promise<boolean> {
  const body = await client<boolean>("/users/findEmail", {
    body: { email },
  });

  return body;
}

export async function updateUser(
  updatedUser: Partial<User>
): Promise<AuthResponse["user"]> {
  const body = await client<AuthResponse>("/users/me", {
    body: { updatedUser },
    method: "PATCH",
  });

  return body.user;
}
