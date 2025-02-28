import { API_URL } from "@/config";
import { AuthResponse, User } from "@/models/user.model";
import { getToken, setToken } from "./auth.service";
import { isApiError } from "@/models/error.model";

export async function findOrCreateGuestUser(email: string): Promise<void> {

  try {
    const response = await fetch(API_URL + "/auth/newOrExist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    const data = (await response.json()) as AuthResponse;

    if (data.token.length > 0)
      setToken(data.token);

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

  } catch (error) {
    console.error(error);
    throw error;
  }

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
      body: JSON.stringify({ updatedUser }),
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
