import { verifyUniqueEmail } from "./user.service";

// Se mantiene para hacer la validación de correo electrónico en el registro del lado del cliente
export async function findEmail(email: string): Promise<boolean> {
  return verifyUniqueEmail(email);
}
