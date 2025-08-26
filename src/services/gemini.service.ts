import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || "",
});

let chatInstance: any = null;

export function getChatInstance() {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [],
    });
  }
  return chatInstance;
}

export async function sendGeminiMessage(message: string) {
  const res = await fetch("/api/gemini-chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
});
  if (!res.ok) throw new Error("Error al contactar a Gemini");
  const data = await res.json();
  return data.text;
}