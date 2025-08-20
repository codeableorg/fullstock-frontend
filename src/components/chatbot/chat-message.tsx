import type { ChatMessage } from "../../services/chatbot.service";

interface ChatMessageProps {
  message: ChatMessage;
  isUserMessage: boolean;
}

export function ChatMessageComponent({ message, isUserMessage }: ChatMessageProps) {
  return (
    <div className={`flex ${isUserMessage ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUserMessage
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}