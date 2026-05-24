"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  time: string;
  isCard?: boolean;
}

const quickReplies = [
  "How's my portfolio doing?",
  "Compare car loans",
  "Tax optimization tips",
  "Best savings strategies",
];

const chatHistory = [
  { title: "Investment Strategy Q3", preview: "How should I rebalance my portfolio for...", time: "2h ago", active: false },
  { title: "Mortgage vs Rent Analysis", preview: "Looking at the current interest rates in...", time: "Yesterday", active: false },
  { title: "Monthly Surplus Plan", preview: "You managed to save ₹450 more than...", time: "Active", active: true },
  { title: "Retirement Projection", preview: "If I increase my contributions by 5%...", time: "3d ago", active: false },
];

export default function FinancialAssistant() {
  const { user, loading } = useAuth();
  const userName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 I'm Finora, your AI financial assistant powered by Gemini. I can help you with budgeting, investments, savings goals, tax tips, and more. What's on your mind today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Update welcome message greeting once auth user loads
  useEffect(() => {
    if (!loading && user) {
      const name = user.displayName?.split(" ")[0] || user.email?.split("@")[0] || "";
      if (name) {
        setMessages(prev =>
          prev.map(m =>
            m.id === 1
              ? { ...m, text: `Hello, ${name}! 👋 I'm Finora, your AI financial assistant powered by Gemini. I can help you with budgeting, investments, savings goals, tax tips, and more. What's on your mind today?` }
              : m
          )
        );
      }
    }
  }, [loading, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function getNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async function sendToGemini(userText: string, history: Message[]) {
    setIsTyping(true);
    setApiError(null);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userText,
          messages: history.slice(-10),
        }),
      });

      // The new route always returns 200 (falls back locally on any error)
      const data = await res.json();
      setUsingFallback(!!data.usingFallback);

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: "bot", text: data.text ?? "I'm not sure how to respond to that. Try asking about budgeting, investments, or tax tips!", time: getNow() },
      ]);
    } catch (err) {
      // Network error (no server running, etc.)
      setIsTyping(false);
      setApiError("Network error");
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: "I couldn't connect to the server right now. Please make sure the app is running and try again.",
          time: getNow(),
        },
      ]);
    }
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { id: Date.now(), sender: "user", text: trimmed, time: getNow() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    sendToGemini(trimmed, messages);
  }

  function handleQuickReply(label: string) {
    if (isTyping) return;
    const userMsg: Message = { id: Date.now(), sender: "user", text: label, time: getNow() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    sendToGemini(label, messages);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCreateGoal() {
    if (!goalName.trim() || !goalAmount.trim()) {
      showToastMsg("Please fill in all fields");
      return;
    }
    showToastMsg(`Goal "${goalName}" created with target ₹${goalAmount}!`);
    setGoalName("");
    setGoalAmount("");
    setShowGoalModal(false);
  }

  // Simple markdown-like formatter for bot responses
  function formatBotText(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code style='background:#f0f0f0;padding:1px 4px;border-radius:3px;font-family:monospace;font-size:0.9em'>$1</code>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <>
      <div className="flex-1 p-10 flex gap-8 overflow-hidden">
        {/* Chat Section */}
        <section className="flex-1 flex flex-col bg-white rounded-[16px] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-outline-variant/30 overflow-hidden">
          {/* Chat Header */}
          <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-primary flex items-center justify-center shadow-[0_4px_20px_rgba(84,66,219,0.2)]">
                <span className="material-symbols-outlined text-white" style={{"fontVariationSettings": "'FILL' 1"}}>smart_toy</span>
              </div>
              <div>
                <h2 className="font-headline-md text-on-surface leading-tight">Finora Assistant</h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${usingFallback ? "bg-amber-400" : "bg-primary"}`}></span>
                  <span className="text-label-sm text-outline">
                    {usingFallback ? "Smart Mode — add Gemini key for full AI" : "Powered by Gemini AI"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${showHistory ? "bg-primary/10 text-primary" : "hover:bg-surface-container text-outline hover:text-primary"}`}
                title="Chat History"
              >
                <span className="material-symbols-outlined">history</span>
              </button>
              <button
                onClick={() => {
                  const name = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "";
                  setMessages([{
                    id: Date.now(),
                    sender: "bot",
                    text: `Hello${name ? `, ${name}` : ""}! 👋 I'm Finora, your AI financial assistant powered by Gemini. How can I help you today?`,
                    time: getNow(),
                  }]);
                  setApiError(null);
                  showToastMsg("Chat cleared");
                }}
                className="p-2 rounded-lg hover:bg-surface-container text-outline hover:text-primary transition-colors"
                title="Clear Chat"
              >
                <span className="material-symbols-outlined">delete_sweep</span>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === "bot" ? "bg-primary/10" : "bg-primary"}`}>
                  <span className={`material-symbols-outlined text-sm ${msg.sender === "bot" ? "text-primary" : "text-white"}`}>
                    {msg.sender === "bot" ? "smart_toy" : "person"}
                  </span>
                </div>
                <div className={`space-y-3 ${msg.sender === "user" ? "text-right" : ""}`}>
                  <div
                    className={`p-4 font-body-md shadow-sm ${
                      msg.sender === "bot"
                        ? "bg-surface-container text-on-surface rounded-[16px] rounded-tl-none border border-outline-variant/30"
                        : "bg-primary text-white rounded-[16px] rounded-tr-none shadow-[0_4px_20px_rgba(84,66,219,0.2)]"
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.sender === "bot" ? formatBotText(msg.text) : msg.text }}
                  />
                  <span className="text-[10px] text-outline px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-[8px] bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                </div>
                <div className="bg-surface-container p-4 rounded-[16px] rounded-tl-none border border-outline-variant/30">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-[11px] text-outline ml-2">Gemini is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-outline-variant/30 bg-surface-container-low/50">
            <div className="flex items-end gap-3 bg-white p-3 rounded-[16px] shadow-sm border border-outline-variant/30 focus-within:border-primary transition-all">
              <button
                onClick={() => showToastMsg("File attachment coming soon!")}
                className="p-2 text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <textarea
                ref={textareaRef}
                className="flex-1 border-none focus:ring-0 p-2 text-body-md resize-none placeholder-outline outline-none bg-transparent"
                placeholder={userName ? `Ask ${userName} about budget, savings, or investments…` : "Ask about your budget, savings, or investments…"}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 ${
                  input.trim() && !isTyping ? "bg-primary text-white hover:opacity-90" : "bg-surface-container text-outline cursor-not-allowed shadow-none"
                }`}
                disabled={!input.trim() || isTyping}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {quickReplies.map(label => (
                <button
                  key={label}
                  onClick={() => handleQuickReply(label)}
                  disabled={isTyping}
                  className="whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary font-label-sm hover:bg-primary/10 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="w-96 flex flex-col gap-6">
          {/* Goals */}
          <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-outline-variant/30 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-on-surface">Current Goals</h3>
              <button onClick={() => showToastMsg("Navigating to all goals...")} className="text-primary font-label-md hover:underline">View all</button>
            </div>
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="font-label-md text-on-surface">Tesla Model 3</p>
                    <p className="text-[10px] text-outline uppercase font-bold">72% Completed</p>
                  </div>
                  <p className="font-headline-md text-on-surface">₹32,400 <span className="text-body-md text-outline font-normal">/ ₹45k</span></p>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-primary rounded-full group-hover:opacity-90 transition-colors"></div>
                </div>
              </div>
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="font-label-md text-on-surface">Emergency Fund</p>
                    <p className="text-[10px] text-outline uppercase font-bold">95% Completed</p>
                  </div>
                  <p className="font-headline-md text-on-surface">₹19,000 <span className="text-body-md text-outline font-normal">/ ₹20k</span></p>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-primary rounded-full group-hover:opacity-90 transition-colors"></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowGoalModal(true)}
              className="w-full py-4 border-2 border-dashed border-outline-variant rounded-[16px] text-outline font-label-md hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">add</span>
              Create New Goal
            </button>
          </div>

          {/* Recent Chats */}
          <div className="flex-1 bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-outline-variant/30 flex flex-col">
            <h3 className="font-headline-md text-on-surface mb-6">Recent Chats</h3>
            <div className="space-y-1 overflow-y-auto pr-2">
              {chatHistory.map((chat, i) => (
                <button
                  key={i}
                  onClick={() => showToastMsg(`Loading chat: "${chat.title}"...`)}
                  className={`w-full text-left p-4 rounded-[12px] transition-all group ${
                    chat.active ? "bg-primary/5 border border-primary/20" : "hover:bg-surface-container border border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className={`font-label-md ${chat.active ? "text-primary" : "text-on-surface group-hover:text-primary"}`}>{chat.title}</p>
                    <span className={`text-[10px] ${chat.active ? "text-primary" : "text-outline"}`}>{chat.time}</span>
                  </div>
                  <p className={`text-label-sm line-clamp-1 ${chat.active ? "text-primary/70" : "text-outline"}`}>&quot;{chat.preview}&quot;</p>
                </button>
              ))}
            </div>
          </div>

          {/* Smart Tip */}
          <div className="bg-primary rounded-[16px] p-6 text-on-primary relative overflow-hidden group shadow-[0_12px_32px_rgba(120,118,129,0.08)]">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                <span className="material-symbols-outlined text-white">lightbulb</span>
              </div>
              <h4 className="font-headline-md mb-2 text-white">Smart Tip</h4>
              <p className="text-body-md text-white/80 mb-4">Users with similar profiles saved 12% more by using Finora&apos;s automated Round-Ups.</p>
              <button
                onClick={() => showToastMsg("✅ Round-Ups enabled! Your spare change will now be invested automatically.")}
                className="px-6 py-2 bg-white text-primary font-bold rounded-lg text-sm hover:scale-105 transition-transform active:scale-95 shadow-[0_4px_20px_rgba(120,118,129,0.05)]"
              >
                Enable Now
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
          </div>
        </aside>
      </div>

      {/* Create Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowGoalModal(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface">Create New Goal</h3>
              <button onClick={() => setShowGoalModal(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-label-md text-outline mb-2">Goal Name</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  placeholder="e.g., Vacation Fund"
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface placeholder-outline"
                />
              </div>
              <div>
                <label className="block font-label-md text-outline mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  value={goalAmount}
                  onChange={e => setGoalAmount(e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface placeholder-outline"
                />
              </div>
              <button
                onClick={handleCreateGoal}
                className="w-full py-3 bg-primary text-white rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all mt-2 shadow-[0_4px_20px_rgba(84,66,219,0.2)]"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-3 animate-slide-up z-50 max-w-md border border-outline-variant/20">
          <span className="material-symbols-outlined shrink-0 text-primary">check_circle</span>
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
