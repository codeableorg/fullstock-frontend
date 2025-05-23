import { client, setToken } from "@/lib/utils";
import { type AuthResponse } from "@/models/user.model";

export async function findOrCreateGuestUser(email: string): Promise<void> {
  const body = await client<AuthResponse>("/auth/newOrExist", {
    body: { email },
  });

  if (body.token.length > 0) {
    setToken(body.token);
  }
}

export async function findEmail(email: string): Promise<boolean> {
  const body = await client<boolean>("/users/findEmail", {
    body: { email },
  });

  return body;
}
