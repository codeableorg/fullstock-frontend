import { GoogleGenAI } from "@google/genai";
import { getGoogleApiKey } from "@/config/google-ai";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class ChatService {
  private ai: GoogleGenAI;
  private chat: any;

  constructor() {
    const apiKey = getGoogleApiKey();

    this.ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    this.initializeChat();
  }

  private initializeChat() {
    const systemPrompt = `Eres un asistente virtual de FullStock, una tienda online que vende productos personalizados como polos, tazas y stickers.

Tu objetivo es ayudar a los clientes con:
- Información sobre productos (polos, tazas, stickers)
- Proceso de compra y checkout
- Preguntas sobre envíos y devoluciones
- Recomendaciones de productos
- Soporte general

Mantén un tono amigable y profesional. Si no puedes ayudar con algo específico, deriva al cliente al soporte humano.

La tienda tiene las siguientes categorías principales:
- Polos: Ropa personalizada de alta calidad
- Tazas: Tazas personalizadas para diferentes ocasiones
- Stickers: Adhesivos personalizados y creativos

Responde de manera concisa y útil.`;

    this.chat = this.ai.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            {
              text: "¡Hola! Soy el asistente virtual de FullStock. Estoy aquí para ayudarte con cualquier pregunta sobre nuestros productos, proceso de compra, o cualquier otra consulta. ¿En qué puedo ayudarte hoy?",
            },
          ],
        },
      ],
    });
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      if (!this.chat) {
        this.initializeChat();
      }

      const response = await this.chat.sendMessage({
        message: message,
      });

      return {
        success: true,
        message: response.text,
      };
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  resetChat() {
    this.initializeChat();
  }
}
