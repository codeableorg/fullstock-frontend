import type { User as PrismaUser } from "@/../generated/prisma/client";

export type User = PrismaUser;

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export type CreateUserDTO = Pick<
  User,
  "email" | "password" | "isGuest" | "name"
>;
