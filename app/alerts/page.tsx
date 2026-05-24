"use client";
import { useState } from "react";

const initialAlerts = [
  { id: 1, icon: "warning", title: "Budget Limit Approaching", desc: "Your 'Dining & Food' category is at 85% of the monthly limit (₹850 of ₹1,000). Consider cooking at home for the next few days.", time: "2 hours ago", type: "warning", read: false },
  { id: 2, icon: "trending_up", title: "Stock Price Alert", desc: "Tesla Inc. (TSLA) has dropped 2.3% — consider reviewing your stop-loss or potential buying opportunities.", time: "5 hours ago", type: "urgent", read: false },
  { id: 3, icon: "check_circle", title: "Goal Milestone Reached", desc: "Your Emergency Fund just crossed the 95% mark! You're only ₹1,000 away from your ₹20,000 goal.", time: "1 day ago", type: "success", read: false },
  { id: 4, icon: "payments", title: "Salary Deposit Received", desc: "+₹3,100.00 credited to your primary account from ACME Corp Payroll.", time: "2 days ago", type: "info", read: true },
  { id: 5, icon: "credit_card", title: "Subscription Renewal", desc: "Netflix subscription (₹19.99) will renew in 3 days on Oct 17.", time: "2 days ago", type: "info", read: true },
  { id: 6, icon: "school", title: "New Quiz Available", desc: "'Stock Market 101' is now unlocked. Start learning to earn more XP!", time: "3 days ago", type: "success", read: true },
  { id: 7, icon: "security", title: "Login from New Device", desc: "A new login was detected from Chrome on Windows (Hyderabad, India).", time: "4 days ago", type: "urgent", read: true },
];

const typeStyles: Record<string, string> = {
  warning: "bg-amber-50/50 border-amber-100 text-amber-800",
  urgent: "bg-red-50/50 border-red-100 text-red-700",
  success: "bg-emerald-50/50 border-emerald-100 text-emerald-700",
  info: "bg-slate-50 border-slate-100 text-slate-600",
};

const iconBg: Record<string, string> = {
  warning: "bg-amber-100 text-amber-600",
  urgent: "bg-red-100 text-red-600",
  success: "bg-emerald-100 text-emerald-600",
  info: "bg-slate-100 text-slate-500",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<"All" | "Urgent" | "Warning" | "Unread">("All");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<typeof initialAlerts[0] | null>(null);

  const unreadCount = alerts.filter(a => !a.read).length;

  const filtered = alerts.filter(a => {
    if (filter === "All") return true;
    if (filter === "Unread") return !a.read;
    return a.type === filter.toLowerCase();
  });

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function markRead(id: number) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }

  function markAllRead() {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    showToastMsg("All notifications marked as read");
  }

  function dismiss(id: number) {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToastMsg("Alert dismissed");
  }

  function clearAll() {
    setAlerts([]);
    showToastMsg("All alerts cleared");
  }

  return (
    <>
      <div className="p-10 max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-2">Notifications</h2>
            <p className="text-body-lg text-outline">
              {unreadCount > 0 ? `You have ${unreadCount} new notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={markAllRead} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline-variant/30 rounded-lg font-semibold text-[14px] text-primary hover:bg-surface-container active:scale-95 transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">done_all</span> Mark All Read
            </button>
            <button onClick={clearAll} className="flex items-center gap-2 px-5 py-2.5 bg-error text-white rounded-lg font-semibold text-[14px] hover:shadow-[0_4px_20px_rgba(204,41,41,0.2)] active:scale-95 transition-all">
              <span className="material-symbols-outlined text-sm">delete_sweep</span> Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
          {(["All", "Unread", "Urgent", "Warning"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-semibold text-[14px] transition-all border ${
                filter === f 
                  ? "bg-primary text-white border-primary shadow-[0_4px_20px_rgba(84,66,219,0.2)]" 
                  : "bg-white text-outline border-outline-variant/30 hover:border-primary/30 hover:bg-surface-container-low"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="bg-white rounded-[16px] border border-outline-variant/30 p-20 text-center shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-outline-variant">notifications_off</span>
              </div>
              <p className="font-display text-2xl text-outline mb-2">No alerts found</p>
              <p className="text-body-md text-outline">Try changing your filter or check back later.</p>
            </div>
          )}
          {filtered.map(a => (
            <div
              key={a.id}
              className={`group flex items-start gap-5 p-6 rounded-[16px] border transition-all hover:shadow-[0_4px_20px_rgba(120,118,129,0.08)] hover:scale-[1.01] cursor-pointer relative ${
                typeStyles[a.type]
              } ${!a.read ? "bg-white shadow-[0_4px_20px_rgba(120,118,129,0.05)] border-primary/20" : "opacity-70 bg-surface-container-low"}`}
              onClick={() => { markRead(a.id); setSelectedAlert(a); }}
            >
              <div className={`w-14 h-14 rounded-[12px] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform ${iconBg[a.type]}`}>
                <span className="material-symbols-outlined text-2xl">{a.icon}</span>
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className={`font-display text-[18px] ${!a.read ? "text-on-surface" : "text-outline"}`}>{a.title}</h4>
                  {!a.read && <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(84,66,219,0.5)]" />}
                </div>
                <p className="text-body-md text-outline line-clamp-1 mb-2">{a.desc}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-outline uppercase tracking-wider">{a.time}</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                  <span className="text-[12px] font-bold text-primary uppercase tracking-widest">{a.type}</span>
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); dismiss(a.id); }}
                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-white text-outline hover:text-error transition-all opacity-0 group-hover:opacity-100"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setSelectedAlert(null)}>
          <div className="bg-white rounded-[16px] p-10 w-full max-w-lg shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-8">
              <div className={`w-16 h-16 rounded-[12px] flex items-center justify-center shadow-sm border border-outline-variant/30 ${iconBg[selectedAlert.type]}`}>
                <span className="material-symbols-outlined text-3xl">{selectedAlert.icon}</span>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <span className="text-[12px] font-bold text-primary uppercase tracking-widest block mb-2">{selectedAlert.type} ALERT</span>
                <h3 className="font-display text-3xl text-on-surface mb-4">{selectedAlert.title}</h3>
                <p className="text-body-lg text-outline leading-relaxed">{selectedAlert.desc}</p>
              </div>
              <div className="p-5 bg-surface-container-low rounded-[12px] border border-outline-variant/30 flex justify-between items-center">
                <span className="text-[14px] font-semibold text-outline">Sent at</span>
                <span className="font-semibold text-[14px] text-on-surface">{selectedAlert.time}</span>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="flex-1 py-4 border border-outline-variant/30 rounded-lg font-bold text-outline hover:bg-surface-container transition-all active:scale-95 text-[16px]"
                >
                  Close
                </button>
                <button
                  onClick={() => { showToastMsg("Action taken! Navigating to relevant section..."); setSelectedAlert(null); }}
                  className="flex-1 py-4 bg-primary text-white rounded-lg font-bold hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] transition-all active:scale-95 text-[16px]"
                >
                  Take Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-3 animate-slide-up z-50 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
