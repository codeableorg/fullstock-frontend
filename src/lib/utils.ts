import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { API_URL, TOKEN_KEY } from "@/config";
import { isApiError } from "@/models/error.model";
import { RequestConfig } from "@/models/request.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function client<T>(
  endpoint: string,
  { body, headers: customHeaders, ...customConfig }: RequestConfig = {}
) {
  const token = getToken();

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...customHeaders,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(API_URL + endpoint, config);
    const data = await response.json();

    if (response.ok) {
      return data as T;
    }

    if (response.status === 401 && token) {
      removeToken();
      // window.location.assign(window.location.pathname);
      window.location.assign("/login");
    }

    if (isApiError(data)) throw new Error(data.error.message);
    throw new Error("Unknown error");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  timeout = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    return new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(func(...args));
      }, timeout);
    });
  };
}
