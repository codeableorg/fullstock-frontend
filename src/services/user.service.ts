import { hashPassword } from "@/lib/security";
import type { User, AuthResponse, CreateUserDTO } from "@/models/user.model";
import * as userRepository from "@/repositories/user.repository";
import { getSession } from "@/session.server";

export async function updateUser(
  updatedUser: Partial<User>,
  request: Request
): Promise<AuthResponse["user"]> {
  const session = await getSession(request.headers.get("Cookie"));
  const id = session.get("userId");

  if (!id) {
    throw new Error("User not authenticated");
  }

  if (updatedUser.password) {
    const hashedPassword = await hashPassword(updatedUser.password);
    updatedUser.password = hashedPassword;
  }

  const userData = await userRepository.updateUser(id, updatedUser);

  return userData;
}

export async function getOrCreateUser(email: string): Promise<User> {
  const existingUser = await userRepository.getUserByEmail(email);

  if (!existingUser) {
    const newUser: CreateUserDTO = {
      email,
      password: null,
      isGuest: true,
      name: null,
    };

    const user = await userRepository.createUser(newUser);

    return user;
  }

  return existingUser;
}
