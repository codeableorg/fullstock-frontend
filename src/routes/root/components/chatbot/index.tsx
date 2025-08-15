import { useEffect, useState } from "react";

import { Button, Input } from "@/components/ui";

export function ChatBot() {
  const [messages, setMessages] = useState<string[]>([
    "🤖: Hola! En que puedo ayudarte?",
  ]);
  const [input, setInput] = useState("");
  const [sessionid, setSessionId] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput("");
    setMessages((prev) => [...prev, `👤: ${input}`]);

    setLoading(true);
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input, sessionid }),
    });

    const { message } = await response.json();

    setMessages((prev) => [...prev, `🤖: ${message}`]);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow-lg bg-background text-foreground w-96 max-h-96">
      <div className="overflow-y-auto max-h-60 mb-4">
        {messages.map((msg, index) => (
          <p className="mb-2" key={index}>
            {msg}
          </p>
        ))}
      </div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <Button size="lg" type="submit" disabled={!input.trim() || loading}>
          {loading ? "Pensando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
