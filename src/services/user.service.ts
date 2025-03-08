import { client, setToken } from "@/lib/utils";
import { AuthResponse, User } from "@/models/user.model";

export async function findOrCreateGuestUser(email: string): Promise<void> {
  const body = await client<AuthResponse>("/auth/newOrExist", {
    body: { email },
  });

  if (body.token.length > 0) {
    setToken(body.token);
  }
}

export async function updateUser(
  updatedUser: Partial<User>
): Promise<AuthResponse["user"]> {
  const body = await client<AuthResponse>("/users/me", {
    body: { updatedUser },
    method: "PATCH",
  });

  setToken(body.token);
  return body.user;
}
