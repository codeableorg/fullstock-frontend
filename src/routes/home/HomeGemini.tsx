import { useEffect, useState } from "react";
import { sendGeminiMessage } from "../../services/gemini.service";

export const HomeGemini = () => {
  const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([
    {
        from: "ai",
        text: "¡Bienvenido a Fullstock! ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre productos, envíos, o cualquier duda que tengas.",
      },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const aiText = await sendGeminiMessage(userMsg);
      setMessages((msgs) => [...msgs, { from: "ai", text: aiText }]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "ai", text: "Ocurrió un error al contactar a Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 border border-gray-300 rounded-lg p-4 max-w-[350px] w-full bg-background shadow-xl">
      <h1 className="text-lg font-bold mb-2">Gemini AI Chat</h1>
      <div className="min-h-[120px] mb-2 overflow-y-auto bg-gray-50 p-2 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === "user" ? "text-right" : "text-left"}>
            <b>{msg.from === "user" ? "Tú" : "Gemini"}:</b> {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-left text-gray-400">
            <b>Gemini:</b> ...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 px-2 py-1 rounded border border-gray-300"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:bg-gray-400"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};