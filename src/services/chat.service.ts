import { type Chat, GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

const chats: { [key: string]: Chat } = {};

export async function sendMessage(message: string, sessionId: string) {
  if (!chats[sessionId]) {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [],
    });

    chats[sessionId] = chat;
  }

  const chat = chats[sessionId];

  const response = await chat.sendMessage({
    message,
  });
  return response.text;
}
