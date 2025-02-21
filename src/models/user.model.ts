export interface User {
  id: number;
  email: string;
  name: string | null;
  password: string | null;
  isGuest: boolean;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}
