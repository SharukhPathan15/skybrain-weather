"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  X,
  Minimize2,
  MessageSquare,
  Loader2,
  Sparkles,
} from "lucide-react";
import { aiChat, getWeeklySummary } from "@/lib/api";

export default function AIChat({ cities, weatherMap }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm your AI weather assistant 🌤️ I can help you understand weather patterns, give advice based on your tracked cities, or answer any weather-related questions. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const history = messages
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));
      const contextMsg = selectedCity
        ? `[User is asking about ${selectedCity.name}] ${msg}`
        : msg;
      const res = await aiChat(contextMsg, cities, history, weatherMap);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.data.response },
      ]);
    } catch (err) {
      console.error("AI Chat Error:", err.response?.data || err.message || err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleWeeklySummary = async () => {
    if (!cities || cities.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please add some cities to your dashboard first!",
        },
      ]);
      return;
    }
    setSummaryLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: "📊 Give me a summary of weather across my cities",
      },
    ]);
    try {
      const res = await getWeeklySummary(cities,weatherMap);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.data.summary },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Could not generate summary right now." },
      ]);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[480px] glass flex flex-col shadow-2xl z-40 animate-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Weather AI</div>
              <div className="text-gray-400 text-xs">AI-powered weather analysis & suggestions</div>
            </div>
            <button
              onClick={handleWeeklySummary}
              disabled={summaryLoading}
              title="Get city summary"
              className="ml-auto p-1.5 text-gray-400 hover:text-purple-300 hover:bg-purple-600/20 rounded-lg transition-all"
            >
              {summaryLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white/10 text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {(loading || summaryLoading) && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {cities && cities.length > 0 && (
            <div className="px-3 pb-2 mt-3 flex gap-1 overflow-x-auto scrollbar-thin">
              <span className="shrink-0 text-xs text-gray-500 py-1.5">
                City:
              </span>
              {cities.map((city) => (
                <button
                  key={city._id}
                  onClick={() =>
                    setSelectedCity(
                      selectedCity?._id === city._id ? null : city,
                    )
                  }
                  className={`shrink-0 text-xs px-2.5 py-1.5 rounded-lg transition-colors border ${
                    selectedCity?._id === city._id
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-white/10 text-gray-300 border-white/10 hover:bg-white/20"
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          )}

          {/* Quick suggestions */}
          <div className="px-3 pb-2 mt-3 flex gap-1 overflow-x-auto scrollbar-thin">
            {["What should I wear?", "Best city today?", "Rain this week?"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="shrink-0 text-xs px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-colors"
                >
                  {s}
                </button>
              ),
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about weather..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
