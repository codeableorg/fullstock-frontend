import { users } from "@/fixtures/users.fixture";
import { User } from "@/models/user.model";

export function findOrCreateGuestUser(email: string): User {
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return existingUser;
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    isGuest: true,
  };
  users.push(newUser);
  return newUser;
}

export function getUserByEmail(email: string): User | null {
  const user = users.find((u) => u.email === email);
  return user || null;
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
    // simulate an API delay
    setTimeout(() => {
      resolve(user);
    }, 1000);
  });
}
