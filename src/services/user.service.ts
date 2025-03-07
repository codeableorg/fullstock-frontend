import { client, getToken, setToken } from "@/lib/utils";
import { AuthResponse, User } from "@/models/user.model";

export async function findOrCreateGuestUser(email: string): Promise<void> {
  const body = await client<AuthResponse>("/auth/newOrExist", {
    body: { email: email },
  });

  if (body.token.length > 0) {
    setToken(body.token);
  }
}

export async function updateUser(
  updatedUser: Partial<User>
): Promise<AuthResponse["user"]> {
  const token = getToken();

  const body = await client<AuthResponse>("/users/me", {
    body: { updatedUser },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
  });

  setToken(body.token);
  return body.user;
}