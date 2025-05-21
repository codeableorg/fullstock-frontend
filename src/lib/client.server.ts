import { API_URL } from "@/config";
import { isApiError } from "@/models/error.model";
import type { RequestConfig } from "@/models/request.model";
import { getSession } from "@/session.server";

export async function serverClient<T>(
  endpoint: string,
  request: Request,
  { body, headers: customHeaders, ...customConfig }: RequestConfig = {}
) {
  // Obtener el token desde las cookies
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...customHeaders,
    },
    credentials: "include",
    ...customConfig,
  };

  try {
    const response = await fetch(API_URL + endpoint, config);

    // Verifica si hay contenido antes de intentar parsear como JSON
    const contentType = response.headers.get("content-type");
    
    let data: unknown;
    if (contentType && contentType.includes("application/json")) {
      // Solo intenta parsear como JSON si el content-type es application/json
      try {
        const text = await response.text();
        // Verificar que el texto no esté vacío antes de parsearlo
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        console.error("Error parsing response as JSON:", parseError);
        throw new Error(`Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    } else {
      // Para respuestas no-JSON
      data = await response.text();
    }

    if (response.ok) {
      return data as T;
    }

    if (response.status === 401 && token) {
      throw new Error("Unauthorized");
    }

    if (isApiError(data)) throw new Error(data.error.message);
    throw new Error("Unknown error");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
