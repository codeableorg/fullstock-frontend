import { sendMessage } from "@/services/chat.service";
import { getSession } from "@/session.server";

import type { Route } from "../root/+types";

export async function action({ request }: Route.ActionArgs) {
  const { message, sessionid } = await request.json();

  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Message cannot be empty");
  }

  // Obtener información de la sesión para recomendaciones personalizadas
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const sessionCartId = session.get("sessionCartId");

  const response = await sendMessage(message, sessionid, userId, sessionCartId);
  return { message: response };
}
