import { useState, useRef, useEffect } from "react";
import { useChat } from "@/contexts/chat.context";
import { ChatService, type ChatMessage } from "@/services/chat.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatProps {
  className?: string;
}

export function Chat({ className }: ChatProps) {
  const { state, addMessage, setLoading, setError } = useChat();
  const [input, setInput] = useState("");
  const [chatService] = useState(() => new ChatService());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [state.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(userMessage.content);

      if (response.success && response.message) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          role: "assistant",
          timestamp: new Date(),
        };
        addMessage(assistantMessage);
      } else {
        setError(response.error || "Error al enviar el mensaje");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-96 border rounded-lg ${className}`}>
      {/* Header */}
      <div className="border-b p-3 bg-gray-50">
        <h3 className="font-semibold text-gray-800">Chat con IA</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {state.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {state.isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
              <p className="text-sm">Escribiendo...</p>
            </div>
          </div>
        )}

        {state.error && (
          <div className="flex justify-center">
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg">
              <p className="text-sm">{state.error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={state.isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || state.isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
