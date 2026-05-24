"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ──────────────────────────────────────────────
   TYPES
────────────────────────────────────────────── */
interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Lesson {
  id: string;
  moduleCode: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgGradient: string;
  xpReward: number;
  duration: string;
  summary: string;
  scenario: {
    character: string;
    story: string;
    insight: string;
  };
  questions: Question[];
}

interface QuizState {
  lessonId: string;
  currentIndex: number;
  selectedOption: number | null;
  isCorrect: boolean | null;
  score: number;
  finished: boolean;
}

/* ──────────────────────────────────────────────
   LESSON DATA  (based on the B1 module image)
────────────────────────────────────────────── */
const lessonsData: Lesson[] = [
  /* ── B1-1  What is Money? ── */
  {
    id: "b1-1",
    moduleCode: "B1 · Slide 1–2",
    title: "What is Money?",
    subtitle: "Foundation — Medium of Exchange · Unit of Account · Store of Value",
    icon: "payments",
    color: "text-emerald-700",
    bgGradient: "from-emerald-50 to-teal-50",
    xpReward: 50,
    duration: "5 min",
    summary:
      "Money is a tool humans invented to make trade easier. Before money existed, people bartered — exchanging goods directly (e.g., rice for cloth). Money solved this by becoming a universal medium everyone agrees has value. It serves three core roles: (1) Medium of Exchange — you use it to buy and sell goods; (2) Unit of Account — it's a standard way to measure the value of things; (3) Store of Value — you can save money today and use it later.",
    scenario: {
      character: "Arjun, 19-year-old student",
      story:
        "Arjun wants to buy a textbook worth ₹500. In a barter world, he would need to find someone who has that exact book AND wants something Arjun can offer — nearly impossible! With money, he simply pays ₹500 and the transaction is done in seconds. The seller can then use that ₹500 to buy groceries, pay rent, or save it for next month.",
      insight:
        "Money removes the 'double coincidence of wants' problem. It is the universal language of trade — accepted by everyone, understood by everyone.",
    },
    questions: [
      {
        question: "Before money existed, how did people trade goods and services?",
        options: ["They used credit cards", "They bartered — exchanging goods directly", "They used gold coins only", "They didn't trade at all"],
        correct: 1,
        explanation: "Barter is the direct exchange of goods and services without money. The problem was you needed to find someone who had what you wanted AND wanted what you had.",
      },
      {
        question: "Which of the following best describes money as a 'Unit of Account'?",
        options: [
          "You can save money for the future",
          "Money is used to buy things",
          "Money provides a standard way to measure the value of things",
          "Money is printed by the government",
        ],
        correct: 2,
        explanation: "Unit of Account means money gives us a common standard to express prices, compare values, and keep financial records.",
      },
      {
        question: "If you earn ₹10,000 and save ₹2,000, what is your savings rate?",
        options: ["10%", "20%", "25%", "30%"],
        correct: 1,
        explanation: "Savings Rate = (Amount Saved ÷ Income) × 100 = (2,000 ÷ 10,000) × 100 = 20%.",
      },
    ],
  },

  /* ── B1-2  Where Does Your Money Go? ── */
  {
    id: "b1-2",
    moduleCode: "B1 · Slide 3–4",
    title: "Where Does Your Money Go?",
    subtitle: "Income · Fixed Expenses · Variable Expenses · What Remains",
    icon: "account_balance_wallet",
    color: "text-violet-700",
    bgGradient: "from-violet-50 to-purple-50",
    xpReward: 75,
    duration: "7 min",
    summary:
      "Every rupee you earn follows a journey: Income arrives (salary, freelance, pocket money), then Fixed Expenses leave first (rent, EMI, subscriptions — you can't avoid these), followed by Variable Expenses (food, travel, shopping — you can control these). What remains after all spending is your potential savings. Aim for a savings rate of at least 20%. Even saving ₹500/month compounds into real wealth over time. The mindset shift: spend what is left AFTER saving, not before.",
    scenario: {
      character: "Priya, 21, College Student",
      story:
        "Priya earns ₹5,000/month from a part-time work. She spends ₹4,200 on food, transport, and fun — saving only ₹800. That's a 16% savings rate — better than 60% of her peers! Priya decides to track her variable expenses for one month. She discovers she spends ₹700 on impulse snacks and rides. By cutting that to ₹400, her savings jump to ₹1,100 — a 22% savings rate. In one year, that's ₹13,200 saved without any extra income.",
      insight:
        "Variable expenses are your biggest lever. Small, consistent cuts — ₹10 here, ₹50 there — compound into thousands over a year.",
    },
    questions: [
      {
        question: "Which of the following is a FIXED expense?",
        options: ["Ordering food delivery", "Buying new clothes", "Monthly EMI payment", "Cinema tickets"],
        correct: 2,
        explanation: "Fixed expenses are non-negotiable monthly costs that remain the same — like rent, loan EMIs, and insurance premiums.",
      },
      {
        question: "Priya earns ₹5,000 and spends ₹4,200. What is her savings rate?",
        options: ["12%", "16%", "20%", "25%"],
        correct: 1,
        explanation: "Savings Rate = (800 ÷ 5,000) × 100 = 16%. Even this relatively small rate beats most of her peers!",
      },
      {
        question: "According to the savings mindset, when should you save?",
        options: [
          "Save whatever is left after all spending",
          "Save only when you get a bonus",
          "Save first, then spend what remains",
          "Save only if your income exceeds ₹20,000",
        ],
        correct: 2,
        explanation: "Pay yourself first! Save a fixed amount immediately when income arrives, then live on the remainder. This ensures consistent savings.",
      },
      {
        question: "A 0–5% savings rate is classified as which zone?",
        options: ["Getting started", "On track", "Finance Ninja", "Danger zone"],
        correct: 3,
        explanation: "The Savings Rate Chart: 0–5% = Danger Zone, 5–15% = Getting Started, 15–30% = On Track, 30%+ = Finance Ninja.",
      },
    ],
  },

  /* ── B1-3  Money Mindset Rules ── */
  {
    id: "b1-3",
    moduleCode: "B1 · Slide 5",
    title: "Money Mindset Rules",
    subtitle: "Do's and Don'ts — Habits that build or break your financial future",
    icon: "psychology",
    color: "text-amber-700",
    bgGradient: "from-amber-50 to-yellow-50",
    xpReward: 60,
    duration: "5 min",
    summary:
      "Your money behaviour matters more than your income. The core Do's: track every rupee (awareness is step one), pay yourself first (save before spending), and think in percentages not amounts. The critical Don'ts: never borrow money to buy things you want (not need), and never ignore small daily expenses — they silently destroy budgets. A ₹50/day unnecessary spend = ₹18,250 lost per year.",
    scenario: {
      character: "Rahul, 24, First Job",
      story:
        "Rahul just got his first salary of ₹30,000. His friend invites him to finance a new gaming console (₹25,000) on a credit card at 36% annual interest. Rahul borrows and pays ₹1,000 more in interest each month. Meanwhile, he ignores his ₹80/day coffee habit (₹2,400/month, ₹28,800/year). Two years later, Rahul has paid ₹24,000 extra in interest and ₹57,600 on coffee — that's ₹81,600 that could have been savings or investments.",
      insight:
        "Small daily expenses and high-interest debt are the two silent wealth destroyers. Awareness + discipline = financial freedom.",
    },
    questions: [
      {
        question: "According to money mindset rules, what should you do FIRST when income arrives?",
        options: ["Pay all bills", "Go shopping", "Pay yourself first — save before spending", "Calculate taxes"],
        correct: 2,
        explanation: "Paying yourself first means setting aside savings immediately, before any discretionary spending occurs.",
      },
      {
        question: "Why should you 'think in percentages, not just amounts'?",
        options: [
          "Percentages are easier to calculate",
          "It helps compare savings behaviour regardless of income level",
          "Banks require percentage reporting",
          "It makes you feel richer",
        ],
        correct: 1,
        explanation: "₹500 saved on ₹2,000 income (25%) is better discipline than ₹1,000 saved on ₹50,000 income (2%). Percentages reveal true financial health.",
      },
      {
        question: "Rahul spends ₹80/day on coffee. How much does this cost per YEAR?",
        options: ["₹14,400", "₹18,250", "₹28,800", "₹36,000"],
        correct: 2,
        explanation: "₹80 × 365 days = ₹29,200 ≈ ₹28,800 (using 30-day months: ₹80 × 30 × 12 = ₹28,800). Small daily habits have massive yearly costs.",
      },
    ],
  },

  /* ── B1-4  Key Financial Terms ── */
  {
    id: "b1-4",
    moduleCode: "B1 · Slide 6",
    title: "Key Financial Terms",
    subtitle: "Mini Glossary — Income · Expense · Savings Rate · Liquidity · Net Worth",
    icon: "menu_book",
    color: "text-sky-700",
    bgGradient: "from-sky-50 to-blue-50",
    xpReward: 50,
    duration: "5 min",
    summary:
      "Five terms every financially literate person must know: Income — money coming in (salary, business revenue, interest). Expense — money going out (rent, food, transport, subscriptions). Savings Rate — % of income you save = (Amount Saved ÷ Income) × 100. Liquidity — how quickly an asset can be converted to cash without loss (cash is most liquid; real estate is least). Net Worth — total value of everything you own minus everything you owe.",
    scenario: {
      character: "Meera, 26, Working Professional",
      story:
        "Meera earns ₹45,000/month (Income). She pays ₹15,000 rent, ₹5,000 food, ₹3,000 transport, ₹2,000 subscriptions = ₹25,000 in Expenses. She saves ₹20,000. Her Savings Rate = (20,000 ÷ 45,000) × 100 = 44% — Finance Ninja level! She has ₹1,50,000 in her bank account (high Liquidity) and a gold necklace worth ₹80,000 (lower Liquidity — takes time to sell). Her Net Worth = ₹1,50,000 + ₹80,000 − ₹0 debt = ₹2,30,000.",
      insight:
        "Net Worth is the ultimate scorecard. Growing it steadily — even by ₹5,000/month — will make you financially independent over time.",
    },
    questions: [
      {
        question: "Meera earns ₹45,000 and saves ₹20,000. What is her savings rate?",
        options: ["33%", "40%", "44%", "50%"],
        correct: 2,
        explanation: "(20,000 ÷ 45,000) × 100 = 44.4% ≈ 44%. That puts her firmly in Finance Ninja territory (30%+)!",
      },
      {
        question: "Which asset has the HIGHEST liquidity?",
        options: ["A house", "Gold jewellery", "A fixed deposit with lock-in", "Cash in a bank savings account"],
        correct: 3,
        explanation: "Liquidity = how fast you can convert to cash without losing value. Cash itself is perfectly liquid. Real estate can take months to sell.",
      },
      {
        question: "How is Net Worth calculated?",
        options: [
          "Total income minus total expenses",
          "Total savings plus total income",
          "Total value of everything you own minus everything you owe",
          "Monthly salary multiplied by 12",
        ],
        correct: 2,
        explanation: "Net Worth = Assets (what you own) − Liabilities (what you owe). It's the definitive measure of your financial health.",
      },
      {
        question: "Which of the following is an EXPENSE, not income?",
        options: ["Business revenue", "Interest earned on savings", "Monthly rent payment", "Freelance payment received"],
        correct: 2,
        explanation: "Expenses are money going OUT — rent, food, transport, subscriptions. Income is money coming IN.",
      },
    ],
  },
];

/* ──────────────────────────────────────────────
   QUIZ CARD – inline lesson quiz
────────────────────────────────────────────── */
interface LessonQuizProps {
  lesson: Lesson;
  onComplete: (score: number, xp: number) => void;
}

function LessonQuiz({ lesson, onComplete }: LessonQuizProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showExp, setShowExp] = useState(false);

  const q = lesson.questions[idx];

  function pick(optIdx: number) {
    if (selected !== null) return;
    const isCorrect = optIdx === q.correct;
    setSelected(optIdx);
    setCorrect(isCorrect);
    setShowExp(true);
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (idx < lesson.questions.length - 1) {
        setIdx((i) => i + 1);
        setSelected(null);
        setCorrect(null);
        setShowExp(false);
      } else {
        setDone(true);
      }
    }, 1800);
  }

  function handleCollect() {
    const earned = Math.round((score / lesson.questions.length) * lesson.xpReward);
    onComplete(score, earned);
  }

  if (done) {
    const earned = Math.round((score / lesson.questions.length) * lesson.xpReward);
    const pct = Math.round((score / lesson.questions.length) * 100);
    return (
      <div className="text-center py-6 space-y-5 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
        </div>
        <div>
          <p className="font-bold text-primary text-2xl">Quiz Complete! 🎉</p>
          <p className="text-outline text-sm mt-1">You scored <strong>{score}/{lesson.questions.length}</strong> ({pct}%)</p>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-black px-4 py-2 rounded-xl text-sm">
            <span className="material-symbols-outlined text-base">stars</span>+{earned} XP
          </span>
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 font-black px-4 py-2 rounded-xl text-sm">
            <span className="material-symbols-outlined text-base">military_tech</span>
            {pct === 100 ? "Master" : pct >= 60 ? "Explorer" : "Keep Trying"}
          </span>
        </div>
        <button
          onClick={handleCollect}
          className="w-full py-3 bg-primary text-white rounded-xl font-black text-base hover:opacity-90 active:scale-95 transition-all"
        >
          Collect Rewards
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex justify-between items-center text-xs font-black text-outline uppercase tracking-wider">
        <span>Question {idx + 1} of {lesson.questions.length}</span>
        <span>{score} correct</span>
      </div>
      <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((idx) / lesson.questions.length) * 100}%` }}
        />
      </div>

      <h4 className="font-bold text-primary text-lg leading-snug pt-2">{q.question}</h4>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = "bg-white border-surface-container-high hover:border-primary/40 hover:bg-primary/5";
          let icon = "radio_button_unchecked";
          let textCls = "text-primary";

          if (selected !== null) {
            if (i === q.correct) {
              cls = "bg-emerald-50 border-emerald-400";
              icon = "check_circle";
              textCls = "text-emerald-700";
            } else if (i === selected && !correct) {
              cls = "bg-red-50 border-red-400";
              icon = "cancel";
              textCls = "text-red-600";
            } else {
              cls = "bg-white border-surface-container-high opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={selected !== null}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left font-medium transition-all duration-300 active:scale-[0.98] ${cls} ${textCls}`}
            >
              <span className="material-symbols-outlined text-lg flex-shrink-0">{icon}</span>
              <span className="text-sm leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExp && (
        <div className={`p-3.5 rounded-xl border text-sm leading-relaxed animate-in slide-in-from-bottom-2 duration-300 ${correct ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <strong>{correct ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.explanation}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────── */
export default function LearnDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const displayName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(12);
  const [xp, setXp] = useState(2550);
  const [quizzesFinished, setQuizzesFinished] = useState(24);
  const [toast, setToast] = useState<string | null>(null);
  const [questStarted, setQuestStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Lesson expansion state
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, "summary" | "scenario" | "quiz">>({});
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizKey, setQuizKey] = useState<Record<string, number>>({});

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleCheckIn() {
    if (!checkedIn) {
      setCheckedIn(true);
      setStreak((prev) => prev + 1);
      setXp((prev) => prev + 50);
      showToastMsg("🎉 Daily check-in complete! +50 XP earned!");
    } else {
      showToastMsg("You've already checked in today!");
    }
  }

  function handleLaunchQuest() {
    setQuestStarted(true);
    setXp((prev) => prev + 100);
    showToastMsg("🚀 Finance Quest: Market Blitz launched! +100 XP");
  }

  function toggleLesson(id: string) {
    if (expandedLesson === id) {
      setExpandedLesson(null);
    } else {
      setExpandedLesson(id);
      if (!activeTab[id]) {
        setActiveTab((prev) => ({ ...prev, [id]: "summary" }));
      }
    }
  }

  function setTab(lessonId: string, tab: "summary" | "scenario" | "quiz") {
    setActiveTab((prev) => ({ ...prev, [lessonId]: tab }));
    // Reset quiz when switching back to it
    if (tab === "quiz") {
      setQuizKey((prev) => ({ ...prev, [lessonId]: (prev[lessonId] ?? 0) + 1 }));
    }
  }

  function handleQuizComplete(lessonId: string, score: number, earnedXp: number) {
    setXp((prev) => prev + earnedXp);
    setQuizzesFinished((prev) => prev + 1);
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
    showToastMsg(`🎊 Lesson Quiz Complete! +${earnedXp} XP earned!`);
    setExpandedLesson(null);
  }

  const xpPercent = Math.min((xp / 3000) * 100, 100);

  const tabClass = (lessonId: string, tab: "summary" | "scenario" | "quiz") =>
    `px-4 py-2 text-xs font-black rounded-lg uppercase tracking-wider transition-all ${
      activeTab[lessonId] === tab
        ? "bg-primary text-white shadow-sm"
        : "text-outline hover:bg-surface-container-high"
    }`;

  return (
    <>
      <div className="p-10 max-w-7xl mx-auto space-y-10">
        {/* ── Welcome Section ── */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-white p-8 rounded-[16px] border border-surface-container-high shadow-[0_4px_20px_rgba(120,118,129,0.05)] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-display text-primary text-4xl mb-4 leading-tight">Welcome back, {displayName}!</h2>
              <p className="text-outline text-body-lg max-w-md">
                You&apos;re only <span className="font-bold text-primary">{Math.max(3000 - xp, 0)} XP</span> away from reaching Level 15. Keep up the momentum!
              </p>
            </div>
            <div className="mt-12 relative z-10">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter shadow-sm">Level 14 Explorer</span>
                </div>
                <span className="font-label-md text-surface-container0 font-bold">{xp.toLocaleString()} / 3,000 XP</span>
              </div>
              <div className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary to-primary rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="col-span-4 bg-primary p-10 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] text-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[16px] flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
                <span className="material-symbols-outlined text-5xl" data-icon="local_fire_department" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
              <p className="font-display text-3xl mb-2">{streak} Day Streak</p>
              <p className="text-primary-fixed-dim/70 font-label-md">
                {checkedIn ? "Daily check-in complete! 🔥" : "Complete your daily check-in!"}
              </p>
              <button
                onClick={handleCheckIn}
                className={`mt-8 w-full py-4 rounded-[8px] font-black text-lg transition-all active:scale-95 shadow-[0_4px_20px_rgba(120,118,129,0.05)] ${
                  checkedIn ? "bg-primary text-primary cursor-default" : "bg-white text-primary hover:bg-primary-fixed"
                }`}
              >
                {checkedIn ? "✓ Checked In!" : "Check-in Now"}
              </button>
            </div>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>
        </section>

        {/* ── Financial Literacy Hub ── */}
        <section>
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">B1 Module</span>
                <span className="text-outline text-xs font-bold uppercase tracking-wider">5 min · 50 XP per lesson</span>
              </div>
              <h3 className="font-display text-primary text-3xl mb-1">Financial Literacy Hub</h3>
              <p className="text-outline text-body-md">Master money basics — read, explore scenarios, then test yourself</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-outline text-sm font-bold">{completedLessons.size}/{lessonsData.length} lessons done</span>
              <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(completedLessons.size / lessonsData.length) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {lessonsData.map((lesson, lessonIndex) => {
              const isExpanded = expandedLesson === lesson.id;
              const tab = activeTab[lesson.id] ?? "summary";
              const isDone = completedLessons.has(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`bg-white rounded-2xl border transition-all duration-500 overflow-hidden ${
                    isExpanded ? "border-primary/30 shadow-[0_8px_32px_rgba(120,118,129,0.12)]" : "border-surface-container-high shadow-[0_2px_8px_rgba(120,118,129,0.05)] hover:shadow-[0_4px_16px_rgba(120,118,129,0.1)]"
                  }`}
                >
                  {/* Lesson Header */}
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className="w-full text-left p-6 flex items-center gap-5 group"
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${lesson.bgGradient} border border-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                      <span className={`material-symbols-outlined text-2xl ${lesson.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{lesson.icon}</span>
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black text-outline uppercase tracking-widest">{lesson.moduleCode}</span>
                        {isDone && (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Completed
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-primary text-xl leading-tight truncate">{lesson.title}</h4>
                      <p className="text-outline text-xs mt-0.5 truncate">{lesson.subtitle}</p>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden md:block">
                        <p className="font-black text-primary text-sm">{lesson.xpReward} XP</p>
                        <p className="text-outline text-[10px] uppercase">{lesson.duration}</p>
                      </div>
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-primary border-primary text-white" : "border-surface-container-high text-outline bg-surface-container group-hover:border-primary/40"}`}>
                        <span className="material-symbols-outlined text-lg" style={{ transition: "transform 0.3s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                          expand_more
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-surface-container-high animate-in slide-in-from-top-2 duration-300">
                      {/* Tab Bar */}
                      <div className="flex gap-2 p-4 pb-0 bg-surface-container/40">
                        <button onClick={() => setTab(lesson.id, "summary")} className={tabClass(lesson.id, "summary")}>
                          📖 Summary
                        </button>
                        <button onClick={() => setTab(lesson.id, "scenario")} className={tabClass(lesson.id, "scenario")}>
                          🎭 Scenario
                        </button>
                        <button onClick={() => setTab(lesson.id, "quiz")} className={tabClass(lesson.id, "quiz")}>
                          ✏️ Quiz ({lesson.questions.length}Q)
                        </button>
                      </div>

                      <div className="p-6">
                        {/* Summary Tab */}
                        {tab === "summary" && (
                          <div className="animate-in fade-in duration-300">
                            <div className={`p-5 rounded-xl bg-gradient-to-br ${lesson.bgGradient} border border-white mb-5`}>
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`material-symbols-outlined text-lg ${lesson.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>summarize</span>
                                <span className={`text-xs font-black uppercase tracking-widest ${lesson.color}`}>Quick Summary</span>
                              </div>
                              <p className="text-primary/80 text-sm leading-relaxed">{lesson.summary}</p>
                            </div>

                            {/* Key Takeaway Cards */}
                            {lesson.id === "b1-1" && (
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  { icon: "swap_horiz", label: "Medium of Exchange", desc: "Buy & sell goods and services" },
                                  { icon: "straighten", label: "Unit of Account", desc: "Standard measure of value" },
                                  { icon: "savings", label: "Store of Value", desc: "Hold value over time" },
                                ].map((item) => (
                                  <div key={item.label} className="p-4 bg-surface-container rounded-xl border border-surface-container-high text-center">
                                    <span className="material-symbols-outlined text-primary text-xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                                    <p className="font-bold text-primary text-xs mb-1">{item.label}</p>
                                    <p className="text-outline text-xs">{item.desc}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {lesson.id === "b1-2" && (
                              <div className="space-y-2">
                                {[
                                  { step: "01", label: "Income Arrives", desc: "Salary, pocket money, freelance, part-time work", icon: "arrow_downward", color: "text-emerald-600 bg-emerald-50" },
                                  { step: "02", label: "Fixed Expenses", desc: "Rent, EMI, subscriptions — non-negotiable monthly costs", icon: "lock", color: "text-red-600 bg-red-50" },
                                  { step: "03", label: "Variable Expenses", desc: "Food, travel, shopping — these can be controlled", icon: "tune", color: "text-amber-600 bg-amber-50" },
                                  { step: "04", label: "What Remains", desc: "This is your potential savings — protect it fiercely!", icon: "savings", color: "text-violet-600 bg-violet-50" },
                                ].map((s) => (
                                  <div key={s.step} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-surface-container-high">
                                    <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
                                      <span className="material-symbols-outlined text-lg">{s.icon}</span>
                                    </div>
                                    <div>
                                      <p className="font-bold text-primary text-sm">{s.label}</p>
                                      <p className="text-outline text-xs">{s.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {lesson.id === "b1-3" && (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                  <p className="font-black text-emerald-700 text-xs uppercase tracking-wider mb-3">✅ DO&apos;s</p>
                                  <ul className="space-y-2 text-xs text-emerald-800">
                                    {["Track every rupee — awareness is step one.", "Pay yourself first: save before spending anything.", "Think in percentages, not just amounts."].map((d) => (
                                      <li key={d} className="flex items-start gap-2"><span className="text-emerald-500 flex-shrink-0">✓</span>{d}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                  <p className="font-black text-red-600 text-xs uppercase tracking-wider mb-3">❌ DON&apos;Ts</p>
                                  <ul className="space-y-2 text-xs text-red-800">
                                    {["Don't spend whatever is left over the month.", "Don't borrow money for things you want (not need).", "Don't ignore small daily expenses — they destroy budgets."].map((d) => (
                                      <li key={d} className="flex items-start gap-2"><span className="text-red-400 flex-shrink-0">✗</span>{d}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                            {lesson.id === "b1-4" && (
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { term: "Income", def: "Money coming in — salary, business revenue, interest earned." },
                                  { term: "Expense", def: "Money going out — rent, food, transport, subscriptions." },
                                  { term: "Savings Rate", def: "(Amount Saved ÷ Income) × 100. Aim for 20%+" },
                                  { term: "Liquidity", def: "How quickly an asset converts to cash without loss." },
                                  { term: "Net Worth", def: "Total value of everything you own minus everything you owe." },
                                ].map((item) => (
                                  <div key={item.term} className="p-3.5 bg-surface-container rounded-xl border border-surface-container-high">
                                    <p className="font-black text-primary text-xs mb-1">{item.term}</p>
                                    <p className="text-outline text-xs leading-relaxed">{item.def}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            <button
                              onClick={() => setTab(lesson.id, "scenario")}
                              className="mt-5 w-full py-3 bg-primary/10 text-primary rounded-xl font-black text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                              Next: Read Real Scenario <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </button>
                          </div>
                        )}

                        {/* Scenario Tab */}
                        {tab === "scenario" && (
                          <div className="animate-in fade-in duration-300 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                              <span className="material-symbols-outlined text-2xl text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                              <div>
                                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Real-Life Scenario</p>
                                <p className="font-bold text-primary">{lesson.scenario.character}</p>
                              </div>
                            </div>

                            <div className="p-5 bg-surface-container rounded-xl border border-surface-container-high">
                              <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2">📖 Story</p>
                              <p className="text-primary/80 text-sm leading-relaxed">{lesson.scenario.story}</p>
                            </div>

                            <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">💡 Key Insight</p>
                              <p className="text-primary font-medium text-sm leading-relaxed">{lesson.scenario.insight}</p>
                            </div>

                            <button
                              onClick={() => setTab(lesson.id, "quiz")}
                              className="w-full py-3 bg-primary text-white rounded-xl font-black text-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                              Ready? Take the Quiz <span className="material-symbols-outlined text-base">quiz</span>
                            </button>
                          </div>
                        )}

                        {/* Quiz Tab */}
                        {tab === "quiz" && (
                          <div className="animate-in fade-in duration-300">
                            <div className="flex items-center gap-3 mb-5 p-4 bg-surface-container rounded-xl border border-surface-container-high">
                              <span className="material-symbols-outlined text-xl text-primary">quiz</span>
                              <div>
                                <p className="font-bold text-primary text-sm">Knowledge Check — {lesson.title}</p>
                                <p className="text-outline text-xs">{lesson.questions.length} questions · Up to {lesson.xpReward} XP</p>
                              </div>
                            </div>
                            <LessonQuiz
                              key={`${lesson.id}-${quizKey[lesson.id] ?? 0}`}
                              lesson={lesson}
                              onComplete={(score, earned) => handleQuizComplete(lesson.id, score, earned)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Quest Banner ── */}
        <section className="bg-primary rounded-[16px] p-1 overflow-hidden relative group shadow-[0_12px_32px_rgba(120,118,129,0.08)]">
          <div className="bg-white/5 backdrop-blur-sm rounded-[calc(3rem-4px)] p-16 flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary p-3 rounded-[8px] shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-primary text-2xl" data-icon="sports_esports" style={{ fontVariationSettings: "'FILL' 1" }}>sports_esports</span>
                </div>
                <span className="font-black text-primary uppercase tracking-widest text-xs">Featured Finance Quest</span>
              </div>
              <h2 className="font-display text-white text-5xl mb-6 leading-tight">Market Blitz:<br />Split-Second Choices</h2>
              <p className="text-primary-fixed-dim/70 text-body-lg mb-10 leading-relaxed">Navigate a simulated market crash. Make the right calls to protect your virtual assets and earn massive rewards.</p>
              <div className="flex gap-6">
                <button
                  onClick={handleLaunchQuest}
                  className={`px-10 py-4 font-black rounded-[8px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] active:scale-95 transition-all text-lg ${
                    questStarted ? "bg-primary text-white" : "bg-primary text-primary hover:bg-emerald-300 shadow-primary/20"
                  }`}
                >
                  {questStarted ? "✓ Quest Active!" : "Start Quest (+1000 XP)"}
                </button>
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="px-10 py-4 bg-transparent border-2 border-white/20 text-white font-black rounded-[8px] hover:bg-white/5 transition-all text-lg"
                >
                  Leaderboard
                </button>
              </div>
            </div>
            <div className="hidden lg:block relative z-10 w-[400px] h-[400px]">
              <div className="absolute inset-0 bg-primary/10 rounded-[16px] rotate-12 group-hover:rotate-[15deg] transition-transform duration-1000" />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md shadow-[0_12px_32px_rgba(120,118,129,0.08)] rounded-[16px] -rotate-6 overflow-hidden flex items-center justify-center border border-white/20 group-hover:-rotate-[8deg] transition-transform duration-1000">
                <img className="w-full h-full object-cover opacity-80" alt="Market Blitz" src="https://images.unsplash.com/photo-1611974717525-5873bb345864?auto=format&fit=crop&q=80&w=800" />
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          </div>
        </section>

        {/* ── Stats Grid ── */}
        <section className="grid grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-surface-container-high hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] transition-all cursor-pointer group" onClick={() => showToastMsg("XP History: Quizzes (+1.2k), Quests (+800), Daily (+550)")}>
            <p className="text-outline font-black text-[10px] uppercase tracking-widest mb-3">Total XP Accumulated</p>
            <p className="font-display text-primary text-4xl group-hover:scale-105 transition-transform">{(12450 + (xp - 2550)).toLocaleString()}</p>
            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              <span>+12.4% vs last week</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-surface-container-high hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] transition-all cursor-pointer group" onClick={() => showToastMsg("You have mastered 70% of the available curriculum!")}>
            <p className="text-outline font-black text-[10px] uppercase tracking-widest mb-3">Quizzes Mastered</p>
            <p className="font-display text-primary text-4xl group-hover:scale-105 transition-transform">{quizzesFinished}</p>
            <div className="mt-6 h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[70%] rounded-full shadow-lg" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-surface-container-high hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] transition-all cursor-pointer group" onClick={() => showToastMsg("Complete the remaining quests to earn the 'Market Maven' badge.")}>
            <p className="text-outline font-black text-[10px] uppercase tracking-widest mb-3">Active Quests</p>
            <p className="font-display text-primary text-4xl group-hover:scale-105 transition-transform">{questStarted ? "04" : "03"}</p>
            <p className="mt-6 text-outline font-bold text-xs uppercase">Expiring in 48 hours</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-surface-container-high hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] transition-all cursor-pointer group" onClick={() => router.push("/budget")}>
            <p className="text-outline font-black text-[10px] uppercase tracking-widest mb-3">Lessons Completed</p>
            <p className="font-display text-primary text-4xl group-hover:scale-105 transition-transform">{completedLessons.size}/{lessonsData.length}</p>
            <div className="mt-6 flex gap-2">
              {lessonsData.map((l) => (
                <div key={l.id} className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-all ${completedLessons.has(l.id) ? "bg-primary" : "bg-surface-container-high"}`}>
                  <span className={`material-symbols-outlined text-sm ${completedLessons.has(l.id) ? "text-white" : "text-outline"}`} style={{ fontVariationSettings: "'FILL' 1" }}>{l.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── Leaderboard Modal ── */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-center justify-center" onClick={() => setShowLeaderboard(false)}>
          <div className="bg-white rounded-[16px] p-10 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-display text-primary text-3xl">🏆 Leaderboard</h3>
              <button onClick={() => setShowLeaderboard(false)} className="p-2 hover:bg-surface-container-high rounded-[8px] transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Sarah K.", xp: "15,200", rank: 1, avatar: "SK" },
                { name: "Mike R.", xp: "14,800", rank: 2, avatar: "MR" },
                { name: "Alex J. (You)", xp: (12450 + (xp - 2550)).toLocaleString(), rank: 3, avatar: "AJ" },
                { name: "Priya M.", xp: "11,900", rank: 4, avatar: "PM" },
                { name: "James L.", xp: "10,450", rank: 5, avatar: "JL" },
              ].map((p) => (
                <div key={p.rank} className={`flex items-center gap-5 p-5 rounded-[16px] transition-all ${p.rank === 3 ? "bg-primary-fixed border border-emerald-200 shadow-md scale-[1.02]" : "border border-surface-container hover:bg-surface-container"}`}>
                  <span className={`w-10 h-10 rounded-[8px] flex items-center justify-center font-black text-lg ${
                    p.rank === 1 ? "bg-amber-400 text-white shadow-lg shadow-amber-400/30" :
                    p.rank === 2 ? "bg-outline-variant text-white shadow-lg shadow-outline-variant/30" :
                    p.rank === 3 ? "bg-primary text-white shadow-lg shadow-primary/30" :
                    "bg-surface-container-high text-outline"
                  }`}>
                    {p.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline-lg text-primary truncate">{p.name}</p>
                    <p className="text-label-sm text-outline uppercase tracking-widest font-bold">Ranking: #{p.rank}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline-lg text-primary">{p.xp}</p>
                    <p className="text-[10px] text-outline-variant font-bold uppercase">Points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-10 right-10 bg-primary text-white px-10 py-5 rounded-[2rem] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-4 animate-slide-up z-[110] border border-emerald-800">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary shadow-lg">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <span className="font-black text-lg">{toast}</span>
        </div>
      )}
    </>
  );
}
