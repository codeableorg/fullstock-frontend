import { client } from "@/lib/utils";

// Se mantiene para hacer la validación de correo electrónico en el registro del lado del cliente
export async function findEmail(email: string): Promise<boolean> {
  const body = await client<boolean>("/users/findEmail", {
    body: { email },
  });

  return body;
}
