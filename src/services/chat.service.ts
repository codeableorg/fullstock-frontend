import { type Chat, GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import type { Product, ProductVariant } from "@/models/product.model";

import { getOrCreateCart } from "./cart.service";
import { getAllCategories } from "./category.service";
import { generateSystemPrompt } from "./chat-system-prompt";
import { getAllProducts } from "./product.service";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

const chats: { [key: string]: Chat } = {};

export async function sendMessage(
  message: string,
  sessionId: string,
  userId?: number,
  sessionCartId?: string
) {
  if (!chats[sessionId]) {
    // Obtener datos de la base de datos
    const [categories, rawProducts] = await Promise.all([
      getAllCategories(),
      getAllProducts(),
    ]);

    // Normalizar posibles precios de variantes (Decimal -> number) para el prompt
    const products: Product[] = rawProducts.map(
      (p): Product => ({
        ...p,
        variants: Array.isArray(p?.variants)
          ? p.variants.map(
              (v): ProductVariant => ({
                ...v,
                price: Number(v.price),
              })
            )
          : undefined,
      })
    );

    // Obtener carrito del usuario si está disponible
    let userCart = null;
    if (userId || sessionCartId) {
      try {
        userCart = await getOrCreateCart(userId, sessionCartId);
      } catch (error) {
        console.warn("No se pudo obtener el carrito del usuario:", error);
      }
    }

    const systemInstruction = generateSystemPrompt({
      categories,
      products,
      userCart,
    });

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [],
      config: {
        systemInstruction,
      },
    });

    chats[sessionId] = chat;
  }

  const chat = chats[sessionId];

  const response = await chat.sendMessage({
    message,
  });
  return response.text;
}