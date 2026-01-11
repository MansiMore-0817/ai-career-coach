import { useState, useEffect } from "react";
import { chatReply } from "../services/ai";
import { formatMessage } from "../utils/cleanMarkdown";

export default function CareerChat() {
  // 1️⃣ Declare state FIRST
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey! Ask me anything about careers 😊" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 2️⃣ Load from storage AFTER state exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem("career-chat");
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  }, []);

  // 3️⃣ Save whenever messages updates
  useEffect(() => {
    try {
      localStorage.setItem("career-chat", JSON.stringify(messages));
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    const updatedHistory = [...messages, userMsg];

    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const reply = await chatReply(updatedHistory);
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, { role: "assistant", text: "Oops! Something went wrong 😢" }]);
    }

    setLoading(false);
  }

  return (
    <main className="overflow-y-auto p-6 flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-4">Career Chat 💬</h2>

      <div className="flex-1 bg-white rounded-lg border shadow-sm p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`prose prose-sm max-w-none p-3 rounded-lg text-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {formatMessage(m.text)
                .split("\n")
                .filter(line => line.trim() !== "")
                .map((line, i) => (
                  <p key={i} className="mb-1 leading-relaxed">{line}</p>
                ))}
            </div>
          ))}

          {loading && (
            <div className="max-w-[75%] bg-gray-200 text-gray-600 p-3 rounded-lg text-sm">
              Thinking... 🧠
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white text-sm ${
              loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
