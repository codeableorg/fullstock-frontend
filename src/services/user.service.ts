import { hashPassword } from "@/lib/security";
import type { Prisma, User } from "generated/prisma/client";
import { prisma } from "@/db/prisma";
import { getSession } from "@/session.server";

export async function updateUser(
  updatedUser: Partial<User>,
  request: Request
): Promise<User> {
  const session = await getSession(request.headers.get("Cookie"));
  const id = session.get("userId");

  if (!id) {
    throw new Error("User not authenticated");
  }

  const data: Prisma.UserUpdateInput = { ...updatedUser };

  if (updatedUser.password) {
    const hashedPassword = await hashPassword(updatedUser.password);
    data.password = hashedPassword;
  }

  const userData = await prisma.user.update({
    where: { id: typeof id === "number" ? id : Number(id) },
    data,
  });

  return userData;
}

export async function getOrCreateUser(email: string): Promise<User> {
  let existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        email,
        password: null,
        isGuest: true,
        name: null,
      },
    });
  }

  return existingUser;
}
