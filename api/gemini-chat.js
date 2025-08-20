import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

router.post("/", async (req, res) => {
  const { message } = req.body;
  try {
    const chat = ai.chats.create({ model: "gemini-2.5-flash", history: [] });
    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (err) {
    res.status(500).json({ error: "Error al contactar a Gemini" });
  }
});

export default router;