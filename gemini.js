import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [],
  });

  const message1 = "Hola, mi nombre es Diego";

  console.log("User: ", message1);

  const response1 = await chat.sendMessageStream({
    message: message1,
  });
  for await (const chunk of response1) {
    console.log(chunk.text);
  }

  const message2 = "Sabes cuál es mi nombre?";
  console.log("User: ", message2);

  const response2 = await chat.sendMessageStream({
    message: message2,
  });
  for await (const chunk of response2) {
    console.log(chunk.text);
  }
}

await main();
