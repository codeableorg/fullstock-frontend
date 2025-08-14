import type { Route } from "./+types/index";
import { Chat } from "@/components/chat/chat";
import { ChatProvider } from "@/contexts/chat.context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat con IA | Fullstock" },
    {
      name: "description",
      content: "Chatea con nuestra IA para obtener ayuda",
    },
  ];
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Chat con IA</h1>
          <p className="text-gray-600 mb-6">
            ¡Hola! Soy tu asistente de IA. Puedo ayudarte con preguntas sobre
            productos, recomendaciones, o cualquier otra consulta relacionada
            con Fullstock.
          </p>
          <Chat className="w-full" />
        </div>
      </div>
    </ChatProvider>
  );
}
