/*
 * Chat — "Glass Horizon" Design
 * AI conversation interface with message bubbles, typing indicator, and model selector
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Bot,
  User,
  Sparkles,
  Copy,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

const CHAT_ACCENT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663083178937/BswsvvE8gzMytEWPKpnfeT/echomen-chat-accent-2o4ABkYxzq8vzi6qiYWS6f.webp";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm **ECHOMEN**, your AI orchestration assistant. I can help you manage agents, analyze code, execute tasks, and much more.\n\nWhat would you like to work on today?",
    timestamp: new Date(Date.now() - 60000),
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about: **"${userMsg.content}"**\n\nThis is a demo of the ECHOMEN chat interface. In production, this would connect to the ECHOMEN backend and route your request through the appropriate AI agent.\n\nHere's what I can help with:\n- \`/agents\` — Manage your AI agents\n- \`/summarize <path>\` — Summarize a codebase\n- \`/execute <task>\` — Run a task through an agent\n\nWould you like to try any of these?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Chat header */}
      <div className="relative h-14 flex items-center justify-between px-6 border-b border-glass-border glass-panel shrink-0">
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <img src={CHAT_ACCENT} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-foreground">ECHOMEN Chat</h2>
            <p className="text-[11px] text-muted-foreground">
              {isTyping ? "Thinking..." : "Online"}
            </p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="h-8 rounded-lg bg-glass border border-glass-border px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="GPT-4o">GPT-4o</option>
            <option value="Claude 3.5">Claude 3.5 Sonnet</option>
            <option value="Gemini Pro">Gemini Pro</option>
          </select>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.5_0.22_280)] text-white"
                    : "glass-panel"
                }`}
              >
                <div className="text-sm leading-relaxed">
                  <Streamdown>{msg.content}</Streamdown>
                </div>
                <div className={`flex items-center gap-2 mt-2 ${msg.role === "user" ? "justify-end" : "justify-between"}`}>
                  <span className={`text-[10px] font-mono ${msg.role === "user" ? "text-white/60" : "text-muted-foreground"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { navigator.clipboard.writeText(msg.content); toast.success("Copied!"); }}
                        className="p-1 rounded hover:bg-glass-hover text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toast.info("Feature coming soon")}
                        className="p-1 rounded hover:bg-glass-hover text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass-panel rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-6 pb-6 pt-2">
        <div className="glass-panel rounded-xl p-3 flex items-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-glass-hover w-9 h-9"
            onClick={() => toast.info("Feature coming soon")}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none max-h-32 py-2"
            style={{ minHeight: "36px" }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0 w-9 h-9 p-0 disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2 font-mono">
          ECHOMEN · Model: {selectedModel} · Powered by multi-agent orchestration
        </p>
      </div>
    </div>
  );
}
