import { GoogleGenAI, type Chat } from "@google/genai";

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
}

class ChatbotService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY || "",
    });
    this.initializeChat();
  }

  private initializeChat(): void {
    this.chat = this.ai.chats.create({
      model: "gemini-2.5-flash",
      history: [],
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      throw new Error("Chat not initialized");
    }

    try {
      const response = await this.chat.sendMessageStream({
        message: message,
      });

      let fullResponse = "";
      for await (const chunk of response) {
        fullResponse += chunk.text;
      }

      return fullResponse;
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw new Error("Failed to get response from AI");
    }
  }

  resetChat(): void {
    this.initializeChat();
  }
}

export const chatbotService = new ChatbotService();