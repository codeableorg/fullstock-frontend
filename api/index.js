import express from "express";
import cors from "cors";    
import geminiChatRouter from "./gemini-chat.js"; 

const app = express();
app.use(express.json());
app.use("/api/gemini-chat", geminiChatRouter);
app.use(cors());

app.listen(3001, () => {
  console.log("API server listening on http://localhost:3001");
});