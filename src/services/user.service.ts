import { API_URL } from "@/config";
import { users } from "@/fixtures/users.fixture";
import { AuthResponse, User } from "@/models/user.model";
import { getToken, setToken } from "./auth.service";
import { isApiError } from "@/models/error.model";

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

export async function updateUser(
  updatedUser: Partial<User>
): Promise<AuthResponse["user"]> {

  try {

    const token = getToken();

      const response = await fetch(API_URL + "/users/me", {
        method: "PATCH",
         headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({ updatedUser}),
      });
  
      const data = (await response.json()) as AuthResponse;
  
      if (!response.ok) {
        if (isApiError(data)) throw new Error(data.error.message);
        throw new Error("Unknown error");
      }
  
      setToken(data.token);
  
      return data.user;
    } catch (error) {
      console.error(error);
      throw error;
    }

}
