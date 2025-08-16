import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chat } from "./chat";
import { ChatProvider } from "@/contexts/chat.context";

interface FloatingChatProps {
  className?: string;
}

export function FloatingChat({ className }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("🎈 FloatingChat: Componente montado");
    return () => {
      console.log("🎈 FloatingChat: Componente desmontado");
    };
  }, []);

  useEffect(() => {
    console.log("🎈 FloatingChat: Estado isOpen cambió a:", isOpen);
  }, [isOpen]);

  const handleToggleOpen = () => {
    console.log("🎈 FloatingChat: Botón clickeado, abriendo chat...");
    setIsOpen(true);
  };

  const handleClose = () => {
    console.log("🎈 FloatingChat: Cerrando chat...");
    setIsOpen(false);
  };

  console.log("🎈 FloatingChat: Renderizando, isOpen:", isOpen);

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={handleToggleOpen}
          className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
          aria-label="Abrir chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 h-96">
          <ChatProvider>
            <div className="relative h-full">
              {/* Close button */}
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm-icon"
                className="absolute top-2 right-2 z-10"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Chat component */}
              <Chat className="h-full border-0" />
            </div>
          </ChatProvider>
        </div>
      )}
    </div>
  );
}
