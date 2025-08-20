import { useEffect, useRef } from "react";

import { ChatInput } from "./chat-input";
import { ChatMessageComponent } from "./chat-message";
import { useChatbot } from "../../hooks/use-chatbot";

export function Chatbot() {
  const { messages, isLoading, isOpen, sendMessage, clearChat, toggleChat } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? "rotate-45" : ""
        }`}
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-96 bg-white rounded-lg shadow-2xl border flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Asistente Virtual</h3>
            <button
              onClick={clearChat}
              className="text-white hover:text-gray-200 text-sm"
            >
              Limpiar
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p>¡Hola! ¿En qué puedo ayudarte?</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <ChatMessageComponent 
                key={message.id} 
                message={message} 
                isUserMessage={index % 2 === 0}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
        </div>
      )}
    </>
  );
}