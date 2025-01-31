import { User } from "@/models/user";

const mockUserDatabase: { [email: string]: User } = {};

export function login(
  email: string,
  password: string
): Promise<Omit<User, "password">> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userRecord = mockUserDatabase[email];
      if (userRecord && userRecord.password === password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPassword, ...userWithoutPassword } = userRecord;
        resolve(userWithoutPassword);
      } else {
        reject(new Error("Correo electrónico o contraseña incorrectos"));
      }
    }, 1000);
  });
}

export function signup(
  email: string,
  password: string
): Promise<Omit<User, "password">> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUserDatabase[email]) {
        reject(new Error("Ya existe una cuenta con este correo electrónico"));
      } else {
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          password,
        };
        mockUserDatabase[email] = newUser;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPassword, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      }
    }, 1000);
  });
}

export function logout(): void {
  // No-op for mock service
}
