import { Bot, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router";

import { Button, Input } from "@/components/ui";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([
    "🤖: Hola! En que puedo ayudarte?",
  ]);
  const [input, setInput] = useState("");
  const [sessionid, setSessionId] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSessionId = sessionStorage.getItem("sessionid");
    if (currentSessionId) {
      setSessionId(currentSessionId);
    } else {
      const newSessionId = crypto.randomUUID();
      sessionStorage.setItem("sessionid", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setInput("");
    setMessages((prev) => [...prev, `👤: ${input}`]);

    setLoading(true);
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, sessionid }),
      });

      const { message } = await response.json();

      setMessages((prev) => [...prev, `🤖: ${message}`]);
    } catch (error) {
      console.error("Error en el chat:", error);
      setMessages((prev) => [
        ...prev,
        "🤖: Lo siento, algo salió mal. Inténtalo de nuevo.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="rounded-full w-16 h-16"
      >
        <Bot size={32} />
      </Button>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-background text-foreground w-96 max-h-[70vh] flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-bold">Chat de Ayuda</h3>
        <Button onClick={() => setIsOpen(false)} size="icon" variant="ghost">
          <X size={24} />
        </Button>
      </div>
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto flex-1 mb-4 pr-2"
      >
        {messages.map((msg, index) => (
          <div className="mb-2" key={index}>
            <Markdown
              components={{
                a: ({ children, href, ...rest }) => (
                  <Link
                    to={href!}
                    className="text-primary font-bold hover:underline"
                    {...rest}
                  >
                    {children}
                  </Link>
                ),
              }}
            >
              {msg}
            </Markdown>
          </div>
        ))}
      </div>
      <form
        className="flex flex-col gap-2 pt-2 border-t"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          name="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          placeholder="Escribe un mensaje..."
        />
        <Button size="lg" type="submit" disabled={!input.trim() || loading}>
          {loading ? "Pensando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
