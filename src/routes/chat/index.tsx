import { sendMessage } from "@/services/chat.service";

import type { Route } from "../root/+types";

export async function action({ request }: Route.ActionArgs) {
  const { message, sessionid } = await request.json();

  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Message cannot be empty");
  }

  const response = await sendMessage(message, sessionid);
  return { message: response };
}
