import { users } from "@/fixtures/users.fixture";
import { User } from "@/models/user.model";

export function findOrCreateGuestUser(email: string): Promise<User> {
  return new Promise((resolve) => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      setTimeout(() => resolve(existingUser), 1000);
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      isGuest: true,
    };
    users.push(newUser);
    setTimeout(() => resolve(newUser), 1000);
  });
}

export function getUserByEmail(email: string): Promise<User | null> {
  return new Promise((resolve) => {
    const user = users.find((u) => u.email === email);
    setTimeout(() => resolve(user || null), 1000);
  });
}

export function updateUser(
  updatedUser: Partial<User> & { id: string }
): Promise<User> {
  return new Promise((resolve, reject) => {
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index === -1) {
      return reject(new Error("User not found"));
    }
    const user = { ...users[index], ...updatedUser };
    users[index] = user;

    setTimeout(() => {
      resolve(user);
    }, 1000);
  });
}
