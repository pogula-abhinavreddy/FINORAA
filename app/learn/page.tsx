"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  xpReward: number;
  image: string;
  status: "In Progress" | "New" | "Locked";
  questions: Question[];
}

const quizzesData: Quiz[] = [
  {
    id: "q1",
    title: "Saving Basics",
    description: "Learn the core principles of high-yield savings and how interest compounds over time.",
    category: "Savings",
    duration: "5 mins",
    xpReward: 300,
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
    questions: [
      {
        question: "What is compound interest?",
        options: ["Interest on the principal only", "Interest on the principal plus accumulated interest", "A flat fee for keeping money in a bank", "Interest that never changes"],
        correct: 1
      },
      {
        question: "What is a 'High-Yield' savings account?",
        options: ["An account with low interest", "An account that pays significantly higher interest than average", "An account for high-risk stocks", "A credit card account"],
        correct: 1
      },
      {
        question: "How often should you ideally contribute to your savings?",
        options: ["Once a year", "Only when you have extra money", "Consistently/Monthly", "Never, just keep it in cash"],
        correct: 2
      }
    ]
  },
  {
    id: "q2",
    title: "Budgeting 101",
    description: "Master the 50/30/20 rule and discover tools to automate your monthly budgeting workflow.",
    category: "Budgeting",
    duration: "8 mins",
    xpReward: 450,
    status: "New",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    questions: [
      {
        question: "In the 50/30/20 rule, what does the '50' stand for?",
        options: ["Wants", "Savings", "Needs", "Taxes"],
        correct: 2
      },
      {
        question: "Which of these is considered a 'Need' in budgeting?",
        options: ["Netflix subscription", "Rent or Mortgage", "Dining at a fancy restaurant", "Designer clothing"],
        correct: 1
      },
      {
        question: "What is the primary benefit of zero-based budgeting?",
        options: ["It ensures every dollar has a specific job", "It means you have zero dollars left", "It's only for people with no debt", "It doesn't require tracking expenses"],
        correct: 0
      }
    ]
  },
  {
    id: "q3",
    title: "Stock Market 101",
    description: "An introduction to equity, dividends, and the basic mechanisms of global stock exchanges.",
    category: "Investing",
    duration: "10 mins",
    xpReward: 600,
    status: "Locked",
    image: "https://images.unsplash.com/photo-1611974717525-5873bb345864?auto=format&fit=crop&q=80&w=800",
    questions: [
      {
        question: "What represents partial ownership in a company?",
        options: ["A bond", "A stock", "A loan", "An insurance policy"],
        correct: 1
      },
      {
        question: "What is a 'Dividend'?",
        options: ["A penalty for selling stocks", "A portion of company earnings paid to shareholders", "The cost of buying a stock", "A type of crypto currency"],
        correct: 1
      },
      {
        question: "What does 'Diversification' mean in investing?",
        options: ["Putting all money into one stock", "Spreading investments across different assets to reduce risk", "Buying only tech stocks", "Checking your portfolio every hour"],
        correct: 1
      }
    ]
  }
];

export default function LearnDashboard() {
  const router = useRouter();
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(12);
  const [xp, setXp] = useState(2550);
  const [quizzesFinished, setQuizzesFinished] = useState(24);
  const [toast, setToast] = useState<string | null>(null);
  const [questStarted, setQuestStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isOptionCorrect, setIsOptionCorrect] = useState<boolean | null>(null);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleCheckIn() {
    if (!checkedIn) {
      setCheckedIn(true);
      setStreak(prev => prev + 1);
      setXp(prev => prev + 50);
      showToastMsg("🎉 Daily check-in complete! +50 XP earned!");
    } else {
      showToastMsg("You've already checked in today!");
    }
  }

  function handleLaunchQuest() {
    setQuestStarted(true);
    setXp(prev => prev + 100);
    showToastMsg("🚀 Finance Quest: Market Blitz launched! +100 XP");
  }

  function startQuiz(quiz: Quiz) {
    if (quiz.status === "Locked") {
      showToastMsg("🔒 Complete the previous quizzes to unlock this one!");
      return;
    }
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setIsQuizFinished(false);
    setIsOptionCorrect(null);
  }

  function handleOptionSelect(index: number) {
    if (selectedOption !== null) return; // Prevent double selection
    
    setSelectedOption(index);
    const correct = index === activeQuiz!.questions[currentQuestionIndex].correct;
    setIsOptionCorrect(correct);
    
    if (correct) {
      setQuizScore(prev => prev + 1);
    }

    // Move to next question after 1s
    setTimeout(() => {
      if (currentQuestionIndex < activeQuiz!.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsOptionCorrect(null);
      } else {
        setIsQuizFinished(true);
      }
    }, 1500);
  }

  function finishQuiz() {
    const earnedXP = Math.round((quizScore / activeQuiz!.questions.length) * activeQuiz!.xpReward);
    setXp(prev => prev + earnedXP);
    setQuizzesFinished(prev => prev + 1);
    showToastMsg(`🎊 Quiz Complete! You earned ${earnedXP} XP!`);
    setActiveQuiz(null);
  }

  const xpPercent = Math.min((xp / 3000) * 100, 100);

  return (
    <>
      <div className="p-10 max-w-7xl mx-auto space-y-10">
        {/* Welcome Section */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-white p-8 rounded-[16px] border border-surface-container-high shadow-[0_4px_20px_rgba(120,118,129,0.05)] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-display text-primary text-4xl mb-4 leading-tight">Welcome back, Alex!</h2>
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
                <div className="h-full bg-gradient-to-r from-primary to-primary rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${xpPercent}%` }}></div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="col-span-4 bg-primary p-10 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] text-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[16px] flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
                <span className="material-symbols-outlined text-5xl" data-icon="local_fire_department" style={{"fontVariationSettings": "'FILL' 1"}}>local_fire_department</span>
              </div>
              <p className="font-display text-3xl mb-2">{streak} Day Streak</p>
              <p className="text-primary-fixed-dim/70 font-label-md">
                {checkedIn ? "Daily check-in complete! 🔥" : "Complete your daily check-in!"}
              </p>
              <button
                onClick={handleCheckIn}
                className={`mt-8 w-full py-4 rounded-[8px] font-black text-lg transition-all active:scale-95 shadow-[0_4px_20px_rgba(120,118,129,0.05)] ${
                  checkedIn
                    ? "bg-primary text-primary cursor-default"
                    : "bg-white text-primary hover:bg-primary-fixed"
                }`}
              >
                {checkedIn ? "✓ Checked In!" : "Check-in Now"}
              </button>
            </div>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </section>

        {/* Quizzes Section */}
        <section>
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <h3 className="font-display text-primary text-3xl mb-2">Financial Quizzes</h3>
              <p className="text-outline text-body-md">Test your knowledge and earn XP to level up</p>
            </div>
            <button
              onClick={() => showToastMsg("Showing all financial quizzes...")}
              className="text-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
            >
              All Quizzes <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {quizzesData.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => startQuiz(quiz)}
                className={`bg-white rounded-[2rem] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-surface-container-high overflow-hidden group cursor-pointer hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col ${quiz.status === "Locked" ? "opacity-60 grayscale-[0.5]" : ""}`}
              >
                <div className="h-48 relative overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={quiz.title} src={quiz.image}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <span className="text-white font-label-md bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/30">{quiz.xpReward} XP</span>
                  </div>
                  {quiz.status === "Locked" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-4xl">lock</span>
                    </div>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm ${
                      quiz.status === "In Progress" ? "bg-primary-fixed text-on-primary-fixed-variant" :
                      quiz.status === "New" ? "bg-secondary-container text-on-secondary-container" :
                      "bg-surface-container-high text-surface-container0"
                    }`}>
                      {quiz.status}
                    </span>
                    <span className="text-outline font-bold text-[10px] uppercase tracking-wider">{quiz.duration}</span>
                  </div>
                  <h4 className="font-headline-lg text-primary text-xl mb-3">{quiz.title}</h4>
                  <p className="text-outline text-sm leading-relaxed mb-6">{quiz.description}</p>
                  <div className="mt-auto pt-6 border-t border-surface-container flex justify-between items-center">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white shadow-sm bg-slate-${i+1}00 flex items-center justify-center text-[10px] font-bold text-outline`}>
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <span className="text-[10px] pl-5 text-outline font-bold self-center uppercase tracking-tighter">+1.2k participants</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-xl">{quiz.status === "Locked" ? "lock" : "quiz"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quest Banner */}
        <section className="bg-primary rounded-[16px] p-1 overflow-hidden relative group shadow-[0_12px_32px_rgba(120,118,129,0.08)]">
          <div className="bg-white/5 backdrop-blur-sm rounded-[calc(3rem-4px)] p-16 flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary p-3 rounded-[8px] shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-primary text-2xl" data-icon="sports_esports" style={{"fontVariationSettings": "'FILL' 1"}}>sports_esports</span>
                </div>
                <span className="font-black text-primary uppercase tracking-widest text-xs">Featured Finance Quest</span>
              </div>
              <h2 className="font-display text-white text-5xl mb-6 leading-tight">Market Blitz:<br/>Split-Second Choices</h2>
              <p className="text-primary-fixed-dim/70 text-body-lg mb-10 leading-relaxed">Navigate a simulated market crash. Make the right calls to protect your virtual assets and earn massive rewards.</p>
              <div className="flex gap-6">
                <button
                  onClick={handleLaunchQuest}
                  className={`px-10 py-4 font-black rounded-[8px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] active:scale-95 transition-all text-lg ${
                    questStarted
                      ? "bg-primary text-white"
                      : "bg-primary text-primary hover:bg-emerald-300 shadow-primary/20"
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
              <div className="absolute inset-0 bg-primary/10 rounded-[16px] rotate-12 group-hover:rotate-[15deg] transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md shadow-[0_12px_32px_rgba(120,118,129,0.08)] rounded-[16px] -rotate-6 overflow-hidden flex items-center justify-center border border-white/20 group-hover:-rotate-[8deg] transition-transform duration-1000">
                <img className="w-full h-full object-cover opacity-80" alt="Market Blitz" src="https://images.unsplash.com/photo-1611974717525-5873bb345864?auto=format&fit=crop&q=80&w=800"/>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
          </div>
        </section>

        {/* Stats Grid */}
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
              <div className="h-full bg-primary w-[70%] rounded-full shadow-lg"></div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-surface-container-high hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] transition-all cursor-pointer group" onClick={() => showToastMsg("Complete the remaining quests to earn the 'Market Maven' badge.")}>
            <p className="text-outline font-black text-[10px] uppercase tracking-widest mb-3">Active Quests</p>
            <p className="font-display text-primary text-4xl group-hover:scale-105 transition-transform">{questStarted ? "04" : "03"}</p>
            <p className="mt-6 text-outline font-bold text-xs uppercase">Expiring in 48 hours</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-surface-container-high hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] transition-all cursor-pointer group" onClick={() => router.push("/budget")}>
            <p className="text-outline font-black text-[10px] uppercase tracking-widest mb-3">Core Mastery</p>
            <p className="font-display text-primary text-4xl group-hover:scale-105 transition-transform">Wealth</p>
            <div className="mt-6 flex gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary text-primary flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-sm">account_balance</span></div>
              <div className="w-8 h-8 rounded-xl bg-primary text-primary flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-sm">trending_up</span></div>
              <div className="w-8 h-8 rounded-xl bg-primary text-primary flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-sm">savings</span></div>
            </div>
          </div>
        </section>
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-primary/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-[16px] w-full max-w-2xl shadow-[0_12px_32px_rgba(120,118,129,0.08)] overflow-hidden relative" onClick={e => e.stopPropagation()}>
            {/* Progress Bar */}
            {!isQuizFinished && (
              <div className="absolute top-0 left-0 right-0 h-2 bg-surface-container-high">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                />
              </div>
            )}

            <div className="p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-outline font-black text-[10px] uppercase tracking-widest mb-1">{activeQuiz.title} Quiz</h3>
                  <p className="font-headline-lg text-primary text-lg">Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</p>
                </div>
                {!isQuizFinished && (
                  <button onClick={() => setActiveQuiz(null)} className="w-12 h-12 rounded-[8px] bg-surface-container flex items-center justify-center text-outline hover:bg-red-50 hover:text-red-500 transition-all">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>

              {!isQuizFinished ? (
                <div className="space-y-10">
                  <h2 className="font-display text-primary text-3xl leading-tight">
                    {activeQuiz.questions[currentQuestionIndex].question}
                  </h2>
                  <div className="space-y-4">
                    {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                      let bgColor = "bg-surface-container border-surface-container-high hover:border-emerald-200 hover:bg-primary-fixed/30";
                      let textColor = "text-primary";
                      let icon = "circle";

                      if (selectedOption === idx) {
                        if (isOptionCorrect) {
                          bgColor = "bg-primary border-primary shadow-[0_4px_20px_rgba(120,118,129,0.05)] shadow-primary/20";
                          textColor = "text-white";
                          icon = "check_circle";
                        } else {
                          bgColor = "bg-red-500 border-red-500 shadow-[0_4px_20px_rgba(120,118,129,0.05)] shadow-red-500/20";
                          textColor = "text-white";
                          icon = "cancel";
                        }
                      } else if (selectedOption !== null && idx === activeQuiz.questions[currentQuestionIndex].correct) {
                        // Highlight correct answer if user got it wrong
                        bgColor = "bg-primary-fixed-dim border-primary";
                        textColor = "text-emerald-700";
                        icon = "check_circle";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={selectedOption !== null}
                          className={`w-full flex items-center gap-6 p-6 rounded-[16px] border text-left font-label-md transition-all duration-300 active:scale-[0.98] ${bgColor} ${textColor}`}
                        >
                          <span className="material-symbols-outlined text-2xl">{icon}</span>
                          <span className="text-lg">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
                  <div className="w-32 h-32 bg-primary-fixed-dim rounded-[16px] flex items-center justify-center mx-auto shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
                    <span className="material-symbols-outlined text-6xl text-primary" style={{"fontVariationSettings": "'FILL' 1"}}>workspace_premium</span>
                  </div>
                  <div>
                    <h2 className="font-display text-primary text-4xl mb-4">Quiz Completed!</h2>
                    <p className="text-outline text-body-lg max-w-md mx-auto">
                      Fantastic work! You scored <span className="font-bold text-primary">{quizScore} / {activeQuiz.questions.length}</span> correct answers.
                    </p>
                  </div>
                  <div className="p-8 bg-surface-container rounded-[16px] border border-surface-container-high flex flex-col items-center">
                    <p className="text-outline font-black text-[10px] uppercase tracking-widest mb-2">Rewards Earned</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-[8px] shadow-lg">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        <span className="font-black">+{Math.round((quizScore / activeQuiz.questions.length) * activeQuiz.xpReward)} XP</span>
                      </div>
                      <div className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-[8px] shadow-lg">
                        <span className="material-symbols-outlined text-sm">military_tech</span>
                        <span className="font-black">Badge: {quizScore === activeQuiz.questions.length ? "Master" : "Explorer"}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={finishQuiz}
                    className="w-full py-5 bg-primary text-on-primary rounded-[1.5rem] font-black text-xl hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] active:scale-95 transition-all shadow-primary/20 shadow-[0_4px_20px_rgba(120,118,129,0.05)]"
                  >
                    Collect Rewards
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-center justify-center" onClick={() => setShowLeaderboard(false)}>
          <div className="bg-white rounded-[16px] p-10 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
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
              ].map(p => (
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

      {toast && (
        <div className="fixed bottom-10 right-10 bg-primary text-white px-10 py-5 rounded-[2rem] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-4 animate-slide-up z-[110] border border-emerald-800">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary shadow-lg">
            <span className="material-symbols-outlined text-2xl" style={{"fontVariationSettings": "'FILL' 1"}}>check_circle</span>
          </div>
          <span className="font-black text-lg">{toast}</span>
        </div>
      )}
    </>
  );
}
