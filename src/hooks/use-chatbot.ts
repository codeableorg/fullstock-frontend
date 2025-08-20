import { useState, useCallback } from "react";

import { chatbotService } from "../services/chatbot.service";

import type { ChatMessage } from "../services/chatbot.service";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(text);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      console.log(e);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, ocurrió un error. Por favor intenta nuevamente.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    chatbotService.resetChat();
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    messages,
    isLoading,
    isOpen,
    sendMessage,
    clearChat,
    toggleChat,
  };
}

