"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const searchSuggestions = [
  { label: "Saving Basics", type: "Quiz", href: "/learn" },
  { label: "Budgeting 101", type: "Quiz", href: "/learn" },
  { label: "Stock Market 101", type: "Quiz", href: "/learn" },
  { label: "Monthly Budget", type: "Page", href: "/budget" },
  { label: "Portfolio Overview", type: "Page", href: "/invest" },
  { label: "Financial Assistant", type: "Page", href: "/assistant" },
  { label: "Security Settings", type: "Page", href: "/safety" },
  { label: "Alerts", type: "Page", href: "/alerts" },
];

const notificationsData = [
  { id: 1, title: "Budget alert: Dining at 85%", time: "2h ago", read: false },
  { id: 2, title: "Tesla stock dropped 2.3%", time: "5h ago", read: false },
  { id: 3, title: "Emergency Fund at 95%!", time: "1d ago", read: true },
];

export default function Header() {
  const router = useRouter();
  const { user, profile, logOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifs, setNotifs] = useState(notificationsData);
  const [toast, setToast] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const avatarLetter = (user?.displayName ?? user?.email ?? "U")[0].toUpperCase();

  async function handleSignOut() {
    await logOut();
    router.replace("/login");
  }

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = searchQuery.trim()
    ? searchSuggestions.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <header className="bg-white/70 backdrop-blur-md flex justify-between items-center h-16 px-10 sticky top-0 z-30 border-b border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
        <div className="flex items-center gap-4 flex-1" ref={searchRef}>
          <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-primary rounded-lg overflow-visible transition-all">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
            <input
              className="w-full bg-surface-container border border-outline-variant/50 py-2 pl-10 pr-4 font-body-md focus:ring-0 focus:border-primary rounded-lg transition-colors"
              placeholder="Search quizzes, terms, or quests..."
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
            />
            {showSearch && filtered.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_32px_rgba(120,118,129,0.08)] border border-outline-variant/20 overflow-hidden z-50">
                {filtered.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { router.push(s.href); setShowSearch(false); setSearchQuery(""); }}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-primary/5 transition-colors text-left"
                  >
                    <span className="font-label-sm text-[14px] text-on-surface">{s.label}</span>
                    <span className="text-label-xs text-outline bg-surface-container px-2 py-0.5 rounded-md">{s.type}</span>
                  </button>
                ))}
              </div>
            )}
            {showSearch && searchQuery.trim() && filtered.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_32px_rgba(120,118,129,0.08)] border border-outline-variant/20 p-6 text-center z-50">
                <span className="material-symbols-outlined text-3xl text-outline mb-2 block">search_off</span>
                <p className="text-body-md text-outline">No results for &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="text-outline hover:text-primary transition-all flex items-center gap-1 relative"
            >
              <span className="material-symbols-outlined" data-icon="notifications_active">notifications_active</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_12px_32px_rgba(120,118,129,0.08)] border border-outline-variant/20 overflow-hidden z-50">
                <div className="px-5 py-3 border-b border-outline-variant/20 flex justify-between items-center">
                  <span className="font-label-sm text-[14px] text-on-surface">Notifications</span>
                  <button
                    onClick={() => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); showToastMsg("All read"); }}
                    className="text-label-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                {notifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => { setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); router.push("/alerts"); setShowNotifs(false); }}
                    className={`px-5 py-3 hover:bg-primary/5 cursor-pointer transition-colors flex items-start gap-3 ${!n.read ? "bg-primary/5" : ""}`}
                  >
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                    <div className={!n.read ? "" : "pl-5"}>
                      <p className="text-body-md text-on-surface">{n.title}</p>
                      <p className="text-label-xs text-outline mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => { router.push("/alerts"); setShowNotifs(false); }}
                  className="w-full px-5 py-3 text-center text-label-sm text-[14px] text-primary hover:bg-primary/5 border-t border-outline-variant/20 font-bold transition-colors"
                >
                  View All Alerts
                </button>
              </div>
            )}
          </div>
          <div className="h-8 w-[1px] bg-outline-variant/30"></div>
          <button
            onClick={() => setShowLessonModal(true)}
            className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-sm text-[14px] hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-300"
          >
            Start New Quiz
          </button>
          {/* User avatar / menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center hover:opacity-90 transition-opacity ring-2 ring-primary/20"
              title={user?.displayName ?? user?.email ?? "Account"}
            >
              {user?.photoURL
                ? <img src={user.photoURL} alt="avatar" className="w-full h-full rounded-full object-cover" />
                : avatarLetter
              }
            </button>
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_12px_32px_rgba(120,118,129,0.12)] border border-outline-variant/20 overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container/40">
                  <p className="font-label-sm text-[14px] text-on-surface truncate">{user?.displayName ?? "User"}</p>
                  <p className="text-label-xs text-outline truncate">{user?.email}</p>
                  {profile && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-label-xs text-primary font-bold">Lvl {profile.level}</span>
                      <span className="text-outline text-label-xs">·</span>
                      <span className="text-label-xs text-on-surface-variant">{profile.xp} XP</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { router.push("/settings"); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-primary/5 text-left transition-colors"
                >
                  <span className="material-symbols-outlined text-outline text-[18px]">manage_accounts</span>
                  <span className="font-label-sm text-[14px] text-on-surface">Account Settings</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-error/5 text-left transition-colors border-t border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-error text-[18px]">logout</span>
                  <span className="font-label-sm text-[14px] text-error">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Lesson Picker Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowLessonModal(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-lg shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-lg text-on-surface">Choose a Quiz</h3>
              <button onClick={() => setShowLessonModal(false)} className="p-2 hover:bg-surface-variant/50 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-3">
              {[
                { title: "Saving Basics", desc: "Core principles of high-yield savings", status: "In Progress", icon: "savings" },
                { title: "Budgeting 101", desc: "Master the 50/30/20 rule", status: "New", icon: "account_balance_wallet" },
                { title: "Stock Market 101", desc: "Intro to equity and dividends", status: "Locked", icon: "trending_up" },
              ].map((quiz, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (quiz.status === "Locked") {
                      showToastMsg("Complete prerequisite quizzes to unlock this!");
                    } else {
                      showToastMsg(`Starting "${quiz.title}" quiz...`);
                      setShowLessonModal(false);
                      // Since we are in Header, we just show a toast for now as the main quiz logic is in page.tsx
                    }
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-[16px] border border-outline-variant/30 transition-all text-left ${
                    quiz.status === "Locked"
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                  }`}
                >
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">{quiz.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-sm text-[14px] text-on-surface">{quiz.title}</p>
                    <p className="text-label-xs text-outline">{quiz.desc}</p>
                  </div>
                  <span className={`text-label-xs font-bold px-3 py-1 rounded-md ${
                    quiz.status === "In Progress" ? "bg-primary text-on-primary" :
                    quiz.status === "New" ? "bg-secondary text-on-secondary" :
                    "bg-surface-container text-outline"
                  }`}>
                    {quiz.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-lg shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-3 animate-slide-up z-50">
          <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
          {toast}
        </div>
      )}
    </>
  );
}
