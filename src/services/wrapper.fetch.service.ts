import { API_URL } from "@/config";
import { getToken, removeToken } from "@/lib/utils";

export async function client(
  endpoint: string,
  { body, ...customConfig }: { body?: string; [key: string]: any } = {}
) {
  const token = getToken();
  const headers: { "content-type": string; Authorization?: string } = {
    "content-type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = body;
  }

  return window
    .fetch(`${API_URL}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        removeToken();
        //window.location.assign(window.location)
        return;
      }
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.text();
        return Promise.reject(new Error(errorMessage));
      }
    });
}
