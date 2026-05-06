"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { sendChatMessage } from "./actions";

interface ChatMessage {
  id: string;
  senderName: string;
  content: string;
  createdAt: string;
}

interface Props {
  currentAdminName: string;
  initialMessages: ChatMessage[];
}

export default function ChatClient({ currentAdminName, initialMessages }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("public:chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const row = payload.new as {
            id: string;
            sender_name: string;
            content: string;
            created_at: string;
          };
          setMessages((prev) =>
            prev.some((m) => m.id === row.id)
              ? prev
              : [
                  ...prev,
                  {
                    id: row.id,
                    senderName: row.sender_name,
                    content: row.content,
                    createdAt: row.created_at,
                  },
                ]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = () => {
    const content = newMessage.trim();
    if (!content || isPending) return;
    setError("");
    startTransition(async () => {
      const res = await sendChatMessage({ content });
      if (res?.error) {
        setError(res.error);
      } else {
        setNewMessage("");
      }
    });
  };

  return (
    <div className="text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white">Chat Administrateurs</h1>
        <p className="text-gray-400">Communication sécurisée entre les membres du staff.</p>
      </div>

      <div className="bg-luxury-black border border-gold/10 rounded-sm shadow-lg flex flex-col overflow-hidden h-[70vh]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const mine = msg.senderName === currentAdminName;
            const system = msg.senderName === "System";
            const colorClass = system
              ? "text-gold bg-gold/10 border border-gold/20"
              : mine
              ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
              : "text-green-400 bg-green-500/10 border border-green-500/20";
            return (
              <div key={msg.id} className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${colorClass}`}
                >
                  {system ? "S" : msg.senderName[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className={`font-medium text-sm ${
                        system
                          ? "text-gold"
                          : mine
                          ? "text-blue-400"
                          : "text-green-400"
                      }`}
                    >
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gold/10 bg-luxury-slate/20 flex items-center gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            maxLength={2000}
            placeholder="Tapez votre message..."
            className="flex-1 bg-transparent border border-gold/10 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-gold/40 transition-all placeholder:text-gray-700"
            disabled={isPending}
          />
          <button
            onClick={handleSend}
            disabled={isPending || !newMessage.trim()}
            className="gold-button px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 mt-4 rounded-sm">
          {error}
        </div>
      )}
    </div>
  );
}
