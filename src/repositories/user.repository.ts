import * as db from "@/db";
import { toSnakeCase } from "@/lib/case-converter";
import { type CreateUserDTO, type User } from "@/models/user.model";

export async function createUser(user: CreateUserDTO): Promise<User> {
  const { email, name, password, isGuest } = user;
  const newUser = await db.queryOne<User>(
    "INSERT INTO users (email, name, password, is_guest) VALUES ($1, $2, $3, $4) RETURNING *",
    [email, name, password, isGuest]
  );

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  return newUser;
}

export async function getUserById(id: User["id"]): Promise<User | null> {
  return await db.queryOne<User>("SELECT * FROM users WHERE id = $1", [id]);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await db.queryOne<User>("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
}

export async function updateUser(
  id: User["id"],
  data: Partial<Omit<User, "id">>
): Promise<User> {
  const setClause = Object.keys(data)
    .map((key, index) => `${toSnakeCase(key)} = $${index + 1}`)
    .join(", ");

  const updateUser = await db.queryOne<User>(
    `UPDATE users SET ${setClause} WHERE id = $${
      Object.keys(data).length + 1
    } RETURNING *`,
    [...Object.values(data), id]
  );

  if (!updateUser) {
    throw new Error("Failed to update user");
  }

  return updateUser;
}

export async function deleteUser(id: User["id"]): Promise<User | null> {
  return await db.queryOne<User>(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
}
