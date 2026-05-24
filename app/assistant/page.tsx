"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  time: string;
  isCard?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "bot",
    text: "Hello Alex! I've been analyzing your spending patterns from last month. You managed to save <strong>₹450 more</strong> than usual. Would you like to see where this surplus came from or perhaps allocate it to your 'New Car' goal?",
    time: "10:24 AM",
  },
  {
    id: 2,
    sender: "user",
    text: "That's great! Show me the breakdown and then suggest a plan for the car goal.",
    time: "10:25 AM",
  },
  {
    id: 3,
    sender: "bot",
    text: "Excellent choice. Here's a quick summary of your efficiency gains:",
    time: "10:26 AM",
    isCard: true,
  },
];

const quickReplies: Record<string, string> = {
  "Compare car loans": "Great question! Here's a comparison of top car loan options:\n\n• **Bank of America**: 4.29% APR, 60 months\n• **Chase Auto**: 4.49% APR, 72 months\n• **Capital One**: 3.99% APR, 48 months\n\nBased on your credit score of 740, I'd recommend Capital One for the lowest rate. Want me to start a pre-approval?",
  "Risk assessment": "Based on your current portfolio analysis:\n\n• **Risk Score**: 6.2/10 (Moderate)\n• **Volatility**: Medium — your Tesla holdings increase overall risk\n• **Diversification**: 8.2/10 — well spread across asset classes\n\n💡 **Recommendation**: Consider reducing TSLA exposure by 5% and reallocating to bonds for better stability.",
  "Tax optimization": "Here are your top tax-saving opportunities:\n\n1. **401(k) Contribution**: You can still contribute ₹4,200 this year to max out\n2. **Tax-Loss Harvesting**: Your TSLA position is down — selling could offset ₹850 in gains\n3. **HSA Contributions**: You have ₹1,400 room remaining\n\nEstimated tax savings: **₹2,100–₹3,400**. Want me to create a detailed plan?",
};

const chatHistory = [
  { title: "Investment Strategy Q3", preview: "How should I rebalance my portfolio for...", time: "2h ago", active: false },
  { title: "Mortgage vs Rent Analysis", preview: "Looking at the current interest rates in...", time: "Yesterday", active: false },
  { title: "Monthly Surplus Plan", preview: "You managed to save ₹450 more than...", time: "Active", active: true },
  { title: "Retirement Projection", preview: "If I increase my contributions by 5%...", time: "3d ago", active: false },
];

export default function FinancialAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function scrollToBottom() {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function getNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addBotReply(text: string) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: "bot", text, time: getNow() },
      ]);
    }, 1200);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "user", text: trimmed, time: getNow() },
    ]);
    setInput("");

    // Auto-resize textarea back
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Generate a smart reply
    const lower = trimmed.toLowerCase();
    if (lower.includes("budget") || lower.includes("spending")) {
      addBotReply("Your current monthly budget utilization is at **60.5%** (₹3,749 of ₹6,200). Your top spending categories are Housing (₹1,600) and Dining (₹850). Would you like me to suggest optimizations?");
    } else if (lower.includes("invest") || lower.includes("stock") || lower.includes("portfolio")) {
      addBotReply("Your portfolio is up **+12.4%** this month, reaching ₹124,592. ETH is your best performer at +4.28%. Your diversification score is 8.2/10. Want a detailed breakdown?");
    } else if (lower.includes("save") || lower.includes("saving") || lower.includes("goal")) {
      addBotReply("Your Emergency Fund is at **95%** (₹19,000/₹20,000) — almost there! 🎉 Your Tesla Model 3 fund is at 72% (₹32,400/₹45,000). At your current saving rate, you'll reach the car goal in approximately 8 months.");
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      addBotReply("Hey Alex! 👋 How can I help you today? I can assist with budgeting, investments, savings goals, or financial lessons.");
    } else {
      addBotReply("That's a great question! Based on your financial profile, I'd recommend reviewing your monthly savings rate and considering automated transfers to your goals. Would you like me to set that up, or would you prefer to explore a different topic?");
    }
  }

  function handleQuickReply(label: string) {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "user", text: label, time: getNow() },
    ]);
    addBotReply(quickReplies[label]);
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

  return (
    <>
      <div className="flex-1 p-10 flex gap-8 overflow-hidden">
        {/* Chat Section */}
        <section className="flex-1 flex flex-col bg-white rounded-[16px] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-outline-variant/30 overflow-hidden">
          {/* Chat Header */}
          <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-primary flex items-center justify-center shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
                <span className="material-symbols-outlined text-white" data-icon="smart_toy" style={{"fontVariationSettings": "'FILL' 1"}}>smart_toy</span>
              </div>
              <div>
                <h2 className="font-headline-md text-on-surface leading-tight">Finora Assistant</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-label-sm text-outline">Online &amp; ready to advise</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${showHistory ? "bg-primary/10 text-primary" : "hover:bg-surface-container text-outline hover:text-primary"}`}
                title="Chat History"
              >
                <span className="material-symbols-outlined" data-icon="history">history</span>
              </button>
              <button
                onClick={() => {
                  setMessages(initialMessages);
                  showToastMsg("Chat cleared");
                }}
                className="p-2 rounded-lg hover:bg-surface-container text-outline hover:text-primary transition-colors"
                title="Clear Chat"
              >
                <span className="material-symbols-outlined" data-icon="more_vert">delete_sweep</span>
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
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                  {msg.isCard && (
                    <div className="bg-white border border-primary/20 rounded-[16px] p-5 shadow-sm space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-primary/5 rounded-[12px]">
                          <p className="text-[10px] uppercase text-primary font-bold tracking-tight">Groceries</p>
                          <p className="font-headline-md text-on-surface">-₹120</p>
                          <p className="text-[10px] text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">arrow_downward</span> 15% vs Avg
                          </p>
                        </div>
                        <div className="p-3 bg-primary/5 rounded-[12px]">
                          <p className="text-[10px] uppercase text-primary font-bold tracking-tight">Subscription</p>
                          <p className="font-headline-md text-on-surface">-₹85</p>
                          <p className="text-[10px] text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span> 2 Canceled
                          </p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full w-[72%] bg-primary rounded-full"></div>
                      </div>
                      <p className="text-label-sm text-outline italic">&quot;By moving this to your car goal, you&apos;ll reach your target 3 months earlier.&quot;</p>
                    </div>
                  )}
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
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-outline rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-outline rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-outline rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                <span className="material-symbols-outlined" data-icon="attach_file">attach_file</span>
              </button>
              <textarea
                ref={textareaRef}
                className="flex-1 border-none focus:ring-0 p-2 text-body-md resize-none placeholder-outline outline-none"
                placeholder="Ask about your budget, savings, or investments..."
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 ${
                  input.trim() ? "bg-primary text-white hover:opacity-90" : "bg-surface-container text-outline cursor-not-allowed shadow-none"
                }`}
                disabled={!input.trim()}
              >
                <span className="material-symbols-outlined" data-icon="send">send</span>
              </button>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {Object.keys(quickReplies).map(label => (
                <button
                  key={label}
                  onClick={() => handleQuickReply(label)}
                  className="whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary font-label-sm hover:bg-primary/10 transition-colors active:scale-95"
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
              <span className="material-symbols-outlined" data-icon="add">add</span>
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
                <span className="material-symbols-outlined text-white" data-icon="lightbulb">lightbulb</span>
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
