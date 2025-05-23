import { serverClient } from "@/lib/client.server";
import { type AuthResponse, type User } from "@/models/user.model";

export async function updateUser(
  updatedUser: Partial<User>,
  request: Request
): Promise<AuthResponse["user"]> {
  const body = await serverClient<AuthResponse>("/users/me", request, {
    body: { updatedUser },
    method: "PATCH",
  });

  return body.user;
}
