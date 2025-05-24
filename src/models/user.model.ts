export interface User {
  id: number;
  email: string;
  name: string | null;
  password: string | null;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

// For creating new users (no id, timestamps)
export type CreateUserDTO = Omit<User, "id" | "createdAt" | "updatedAt">;
