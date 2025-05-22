import { serverClient } from "@/lib/client.server";
import { client } from "@/lib/utils";
import { type AuthResponse, type User } from "@/models/user.model";

// Se mantiene para hacer la validación de correo electrónico en el registro del lado del cliente
export async function findEmail(email: string): Promise<boolean> {
  const body = await client<boolean>("/users/findEmail", {
    body: { email },
  });

  return body;
}

// TODO: Eliminar este método una vez que se implemente la ruta account
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
