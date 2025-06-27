import type { User as PrismaUser } from "generated/prisma/client";

export type User = PrismaUser;

export interface AuthResponse {
  user: User;
  token: string;
}
