import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { API_URL, TOKEN_KEY } from "@/config";
import { RequestConfig } from "@/models/request.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function getToken(): string | null {
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
  { data, headers: customHeaders, auth = true, ...customConfig }: RequestConfig = {}
) {
  const config: RequestConfig = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
    ...customConfig,
  };

  // Add auth token if auth is required and token exists
  if (auth) {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(API_URL + endpoint, config);
    const data = await response.json();

    if (response.ok) {
      return data as T;
    } else {
      return Promise.reject(data);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
