import { Chat } from "@/components/chat/chat";
import { ChatProvider } from "@/contexts/chat.context";

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Chat de Soporte</h1>
        <ChatProvider>
          <Chat className="h-[600px] border rounded-lg" />
        </ChatProvider>
      </div>
    </div>
  );
}
