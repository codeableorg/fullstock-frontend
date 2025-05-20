import { API_URL } from "@/config";
import { isApiError } from "@/models/error.model";
import type { RequestConfig } from "@/models/request.model";
import { getSession } from "@/session.server";
import { getUrlWithParams } from "./utils";

export async function serverClient<T>(
  endpoint: string,
  request: Request,
  { body, headers: customHeaders, includeCartSessionId = false, ...customConfig }: RequestConfig & { includeCartSessionId?: boolean } = {}
) {
  // Obtener el token y el cartSessionId desde las cookies de la sesión
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader || "");
  const token = session.get("token");
  const cartSessionId = session.get("cartSessionId");

  // Construir la URL con el cartSessionId si es necesario
  const url = includeCartSessionId && cartSessionId
    ? getUrlWithParams(API_URL + endpoint, { cartId: cartSessionId })
    : API_URL + endpoint;

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
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.ok) {
      return data as T;
    }

    if (response.status === 401 && token) {
      // En lugar de eliminar el token y redirigir, emitir un error customizado
      // para el caller se encargue de manejar el caso de error de autenticación
      throw new Error("Unauthorized");
      // removeToken();
      // window.location.assign(window.location.pathname);
      // window.location.assign("/login");
    }

    if (isApiError(data)) throw new Error(data.error.message);
    throw new Error("Unknown error");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
