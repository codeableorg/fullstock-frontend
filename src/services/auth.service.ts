import { API_URL } from "@/config";
import { users } from "@/fixtures/users.fixture";
import { isApiError } from "@/models/error.model";
import { User } from "@/models/user.model";
import { getUserByEmail } from "@/services/user.service";

const TOKEN_KEY = "auth_token";

interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

function generateMockToken(user: User): string {
  // Mock JWT token
  return btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function getCurrentUser(): Promise<Omit<User, "password"> | null> {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    const userEmail = payload.email;
    const user = await getUserByEmail(userEmail);
    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  // try {
  //   const response = await fetch(API_URL + "/auth/login");

  //   const data = await response.json();

  //   if (!response.ok) {
  //     if (isApiError(data)) throw new Error(data.error.message);
  //     throw new Error("Unknown error");
  //   }

  //   return data as Category[];
  // } catch (error) {
  //   console.error(error);
  //   throw error;
  // }
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const userRecord = await getUserByEmail(email);
      if (userRecord && userRecord.password === password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPassword, ...userWithoutPassword } = userRecord;
        const token = generateMockToken(userRecord);
        localStorage.setItem(TOKEN_KEY, token);
        resolve({ user: userWithoutPassword, token });
      } else {
        reject(new Error("Correo electrónico o contraseña incorrectos"));
      }
    }, 1000);
  });
}

export async function signup(
  email: string,
  password: string
): Promise<Omit<User, "password">> {
  try {
    const response = await fetch(API_URL + "/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    localStorage.setItem(TOKEN_KEY, data.token);

    return data.user as Omit<User, "password">;
  } catch (error) {
    console.error(error);
    throw error;
  }
  // return new Promise((resolve, reject) => {
  //   setTimeout(async () => {
  //     const existingUser = await getUserByEmail(email);

  //     if (existingUser && !existingUser.isGuest) {
  //       reject(new Error("Ya existe una cuenta con este correo electrónico"));
  //       return;
  //     }

  //     let user: User;

  //     if (existingUser) {
  //       user = {
  //         ...existingUser,
  //         password,
  //         isGuest: false,
  //       };
  //     } else {
  //       user = {
  //         id: crypto.randomUUID(),
  //         email,
  //         password,
  //         isGuest: false,
  //       };
  //     }

  //     users.push(user);
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password: userPassword, ...userWithoutPassword } = user;
  //     const token = generateMockToken(user);
  //     localStorage.setItem(TOKEN_KEY, token);
  //     resolve({ user: userWithoutPassword, token });
  //   }, 1000);
  // });
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
