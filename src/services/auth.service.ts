import { users } from "@/fixtures/users.fixture";
import { User } from "@/models/user.model";

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

export function getCurrentUser(): Promise<Omit<User, "password"> | null> {
  return new Promise((resolve) => {
    const token = getStoredToken();
    if (!token) {
      resolve(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        resolve(null);
        return;
      }

      // In a real implementation, validate the token with the backend
      setTimeout(() => {
        const userEmail = payload.email;
        const user = users[userEmail];
        if (!user) {
          resolve(null);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      }, 500);
    } catch {
      resolve(null);
    }
  });
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userRecord = users[email];
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

export function signup(email: string, password: string): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users[email]) {
        reject(new Error("Ya existe una cuenta con este correo electrónico"));
      } else {
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          password,
        };
        users[email] = newUser;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPassword, ...userWithoutPassword } = newUser;
        const token = generateMockToken(newUser);
        localStorage.setItem(TOKEN_KEY, token);
        resolve({ user: userWithoutPassword, token });
      }
    }, 1000);
  });
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
