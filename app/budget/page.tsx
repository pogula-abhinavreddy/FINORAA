"use client";
import { useState } from "react";

interface Expense {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
  isIncome: boolean;
}

interface JournalEntry {
  id: number;
  text: string;
  date: string;
  parsedAmount: number | null;
  category: string;
}

const initialTransactions: Expense[] = [
  { id: 1, name: "Whole Foods Market", category: "Groceries", amount: -142.30, date: "Oct 14, 2023", icon: "shopping_bag", isIncome: false },
  { id: 2, name: "Starbucks Coffee", category: "Dining", amount: -6.45, date: "Oct 13, 2023", icon: "coffee", isIncome: false },
  { id: 3, name: "Salary Deposit", category: "Income", amount: 3100.00, date: "Oct 12, 2023", icon: "payments", isIncome: true },
  { id: 4, name: "Netflix Subscription", category: "Entertainment", amount: -19.99, date: "Oct 11, 2023", icon: "movie", isIncome: false },
];

const initialBudgets = [
  { category: "Dining & Food", icon: "restaurant", spent: 850, limit: 1000 },
  { category: "Housing & Utilities", icon: "home", spent: 1600, limit: 1600 },
  { category: "Transportation", icon: "directions_car", spent: 320, limit: 500 },
  { category: "Entertainment", icon: "sports_esports", spent: 150, limit: 400 },
];

const csvData = {
  "Oct 2023": [
    { date: "Oct 14", name: "Whole Foods Market", category: "Groceries", amount: -142.30 },
    { date: "Oct 13", name: "Starbucks Coffee", category: "Dining", amount: -6.45 },
    { date: "Oct 12", name: "Salary Deposit", category: "Income", amount: 3100.00 },
    { date: "Oct 11", name: "Netflix Subscription", category: "Entertainment", amount: -19.99 },
    { date: "Oct 09", name: "Uber Ride", category: "Transportation", amount: -18.50 },
    { date: "Oct 07", name: "Electricity Bill", category: "Housing", amount: -95.00 },
    { date: "Oct 05", name: "Freelance Payment", category: "Income", amount: 1200.00 },
    { date: "Oct 03", name: "Zomato Order", category: "Dining", amount: -34.80 },
  ],
  "Sep 2023": [
    { date: "Sep 28", name: "Amazon Purchase", category: "Entertainment", amount: -67.99 },
    { date: "Sep 25", name: "Salary Deposit", category: "Income", amount: 3100.00 },
    { date: "Sep 22", name: "Gym Membership", category: "Housing", amount: -49.00 },
    { date: "Sep 19", name: "Swiggy Order", category: "Dining", amount: -28.60 },
    { date: "Sep 15", name: "Metro Card Recharge", category: "Transportation", amount: -500.00 },
    { date: "Sep 10", name: "Medical Checkup", category: "Other", amount: -1200.00 },
    { date: "Sep 05", name: "Freelance Payment", category: "Income", amount: 800.00 },
    { date: "Sep 02", name: "Grocery Store", category: "Groceries", amount: -210.00 },
  ],
  "Aug 2023": [
    { date: "Aug 30", name: "Rent Payment", category: "Housing", amount: -1600.00 },
    { date: "Aug 27", name: "Salary Deposit", category: "Income", amount: 3100.00 },
    { date: "Aug 24", name: "Hotstar Subscription", category: "Entertainment", amount: -299.00 },
    { date: "Aug 20", name: "Petrol", category: "Transportation", amount: -2200.00 },
    { date: "Aug 17", name: "Restaurant Dinner", category: "Dining", amount: -1450.00 },
    { date: "Aug 12", name: "Freelance Payment", category: "Income", amount: 1500.00 },
    { date: "Aug 08", name: "Medicine", category: "Other", amount: -340.00 },
    { date: "Aug 03", name: "Supermarket", category: "Groceries", amount: -890.00 },
  ],
};
type MonthKey = keyof typeof csvData;

export default function BudgetTracking() {
  const [transactions, setTransactions] = useState<Expense[]>(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ name: "", category: "Dining", amount: "" });
  const [toast, setToast] = useState<string | null>(null);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  // Feature 1 — Income
  const [totalIncome, setTotalIncome] = useState(6200);
  const [showSetIncome, setShowSetIncome] = useState(false);
  const [incomeForm, setIncomeForm] = useState("");

  // Feature 2 — Journal
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showJournalInput, setShowJournalInput] = useState(false);
  const [journalForm, setJournalForm] = useState({ text: "", category: "Other" });

  // Feature 3 — CSV / Visualize
  const [activeMonth, setActiveMonth] = useState<MonthKey>("Oct 2023");
  const [showVisualize, setShowVisualize] = useState(false);

  const totalSpent = transactions.filter(t => !t.isIncome).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const remaining = totalIncome - totalSpent;

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleAddExpense() {
    if (!expenseForm.name.trim() || !expenseForm.amount.trim()) {
      showToastMsg("Please fill in all fields");
      return;
    }
    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      showToastMsg("Please enter a valid amount");
      return;
    }
    const icons: Record<string, string> = {
      "Dining": "restaurant", "Groceries": "shopping_bag", "Entertainment": "movie",
      "Transportation": "directions_car", "Housing": "home", "Other": "receipt_long"
    };
    const newTx: Expense = {
      id: Date.now(),
      name: expenseForm.name,
      category: expenseForm.category,
      amount: -amount,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      icon: icons[expenseForm.category] || "receipt_long",
      isIncome: false,
    };
    setTransactions(prev => [newTx, ...prev]);
    setExpenseForm({ name: "", category: "Dining", amount: "" });
    setShowAddExpense(false);
    showToastMsg(`Expense "₹${amount.toFixed(2)} — ${expenseForm.name}" added!`);
  }

  function handleExportReport() {
    showToastMsg("📄 Budget report for October 2023 exported as PDF!");
  }

  function handleEditBudgetSave() {
    setShowEditBudget(false);
    showToastMsg("Budget limits updated successfully!");
  }

  // Feature 1 — Set Income handler
  function handleSetIncome() {
    const parsed = parseFloat(incomeForm);
    if (isNaN(parsed) || parsed <= 0) {
      showToastMsg("Please enter a valid income amount");
      return;
    }
    setTotalIncome(parsed);
    setShowSetIncome(false);
    setIncomeForm("");
    showToastMsg(`✅ Monthly income updated to ₹${parsed.toLocaleString()}!`);
  }

  // Feature 2 — Save Journal Entry
  function handleSaveJournal() {
    if (!journalForm.text.trim()) {
      showToastMsg("Please write something in your journal entry.");
      return;
    }
    const amountRegex = /[₹](\d+(?:\.\d+)?)|[Rr]s\s*(\d+(?:\.\d+)?)/;
    const match = journalForm.text.match(amountRegex);
    let parsedAmount: number | null = null;
    if (match) {
      parsedAmount = parseFloat(match[1] ?? match[2]);
    }

    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const newEntry: JournalEntry = {
      id: Date.now(),
      text: journalForm.text,
      date: today,
      parsedAmount,
      category: journalForm.category,
    };

    setJournalEntries(prev => [newEntry, ...prev]);

    if (parsedAmount !== null) {
      const newTx: Expense = {
        id: Date.now() + 1,
        name: "Journal: " + journalForm.text.slice(0, 40),
        category: journalForm.category,
        amount: -parsedAmount,
        date: today,
        icon: "menu_book",
        isIncome: false,
      };
      setTransactions(prev => [newTx, ...prev]);
      showToastMsg(`📓 Journal saved! ₹${parsedAmount} added to your expenses.`);
    } else {
      showToastMsg("📓 Journal entry saved.");
    }

    setJournalForm({ text: "", category: "Other" });
    setShowJournalInput(false);
  }

  // Feature 3 — Download CSV
  function handleDownloadCSV(month: MonthKey) {
    const rows = csvData[month];
    const header = "Date,Description,Category,Amount\n";
    const body = rows.map(r => `${r.date},"${r.name}",${r.category},${r.amount}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finoraa_${month.replace(" ", "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToastMsg(`📥 ${month} CSV downloaded!`);
  }

  // Feature 3 — Compute chart data
  function getMonthTotalExpense(month: MonthKey): number {
    return csvData[month].filter(r => r.amount < 0).reduce((sum, r) => sum + Math.abs(r.amount), 0);
  }

  function getCategoryTotals(): { category: string; total: number }[] {
    const map: Record<string, number> = {};
    (Object.keys(csvData) as MonthKey[]).forEach(month => {
      csvData[month].filter(r => r.amount < 0).forEach(r => {
        map[r.category] = (map[r.category] || 0) + Math.abs(r.amount);
      });
    });
    return Object.entries(map)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }

  const months: MonthKey[] = ["Oct 2023", "Sep 2023", "Aug 2023"];
  const monthTotals = months.map(m => ({ month: m, total: getMonthTotalExpense(m) }));
  const maxMonthTotal = Math.max(...monthTotals.map(m => m.total));
  const categoryTotals = getCategoryTotals();
  const maxCatTotal = Math.max(...categoryTotals.map(c => c.total));

  return (
    <>
      <div className="p-10 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display text-on-surface mb-2 text-3xl">Monthly Budget</h2>
            <p className="text-body-lg text-outline">Overview for October 2023</p>
          </div>
          <div className="flex gap-4">
            {/* Feature 1 — Set Income Button */}
            <button
              onClick={() => { setIncomeForm(String(totalIncome)); setShowSetIncome(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-outline-variant/30 text-primary font-semibold text-[14px] rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span> Set Income
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-outline-variant/30 text-primary font-semibold text-[14px] rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined" data-icon="file_download">file_download</span> Export Report
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-[14px] rounded-lg hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined" data-icon="add">add</span> Add Expense
            </button>
          </div>
        </div>

        {/* Balance Card + Savings Goal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-primary p-8 rounded-[16px] text-white flex flex-col justify-between relative overflow-hidden shadow-[0_4px_20px_rgba(84,66,219,0.2)]">
            <div className="relative z-10">
              <p className="text-white/80 font-semibold text-[12px] mb-2 uppercase tracking-wider">Total Remaining Balance</p>
              <h3 className="text-5xl font-bold font-display mb-8 text-white">₹{remaining.toFixed(2)}</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-white/80 text-[12px] font-semibold mb-1">Monthly Income</p>
                  <p className="text-xl font-headline-md text-white">₹{totalIncome.toLocaleString()}.00</p>
                </div>
                <div>
                  <p className="text-white/80 text-[12px] font-semibold mb-1">Total Spent</p>
                  <p className="text-xl font-headline-md text-white">₹{totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-8 rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" data-icon="savings">savings</span>
              </div>
              <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[12px] font-semibold tracking-wider">82% Achieved</span>
            </div>
            <p className="text-outline font-semibold text-[14px] mb-1">Emergency Fund</p>
            <h4 className="text-xl font-headline-md text-on-surface mb-auto">₹12,300 / ₹15,000</h4>
            <div className="mt-6">
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="w-[82%] h-full bg-primary transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Spending by Category + Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white p-8 rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
            <h3 className="font-headline-md text-on-surface text-xl mb-6">Spending by Category</h3>
            <div className="space-y-6">
              {budgets.map((b, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">{b.icon}</span>
                      <span className="font-semibold text-[14px] text-on-surface">{b.category}</span>
                    </div>
                    <span className="font-semibold text-[14px] text-outline">₹{b.spent} / ₹{b.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${b.spent >= b.limit ? "bg-error" : "bg-primary"}`}
                      style={{ width: `${Math.min((b.spent / b.limit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowEditBudget(true)}
              className="w-full mt-8 py-3 border border-dashed border-outline-variant/50 rounded-lg text-outline font-semibold text-[14px] hover:bg-surface-container hover:text-primary transition-colors active:scale-[0.98]"
            >
              Edit Budget Limits
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-8 rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">Recent Transactions</h3>
              <button
                onClick={() => setShowAllTransactions(true)}
                className="text-primary font-semibold text-[14px] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 4).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => showToastMsg(`${tx.name}: ${tx.isIncome ? "+" : ""}₹${Math.abs(tx.amount).toFixed(2)} on ${tx.date}`)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center ${tx.isIncome ? "bg-primary/10 text-primary" : "bg-surface-container text-outline"}`}>
                      <span className="material-symbols-outlined">{tx.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[16px] text-on-surface">{tx.name}</p>
                      <p className="text-[12px] font-semibold tracking-wider uppercase text-outline">{tx.date} • {tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-[16px] ${tx.isIncome ? "text-primary" : "text-on-surface"}`}>
                      {tx.isIncome ? "+" : ""}{tx.amount < 0 ? "-" : ""}₹{Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <span className="material-symbols-outlined text-outline/50 opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 2 — Budget Journal */}
        <div className="bg-white p-8 rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-on-surface text-xl">Budget Journal</h3>
            <button
              onClick={() => setShowJournalInput(prev => !prev)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-[14px] rounded-lg hover:opacity-90 shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span> + New Entry
            </button>
          </div>

          {/* Inline journal input */}
          {showJournalInput && (
            <div className="mb-6 p-6 bg-surface-container-low rounded-[12px] border border-outline-variant/30 space-y-4">
              <textarea
                value={journalForm.text}
                onChange={e => setJournalForm(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Write your budget note... e.g. 'Spent ₹200 on petrol today'"
                className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 resize-none h-24 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface text-[14px] bg-white"
              />
              <select
                value={journalForm.category}
                onChange={e => setJournalForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-on-surface"
              >
                <option>Dining</option>
                <option>Groceries</option>
                <option>Entertainment</option>
                <option>Transportation</option>
                <option>Housing</option>
                <option>Other</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveJournal}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold text-[14px] hover:opacity-90 shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all"
                >
                  Save Entry
                </button>
                <button
                  onClick={() => { setJournalForm({ text: "", category: "Other" }); setShowJournalInput(false); }}
                  className="flex-1 py-3 border border-outline-variant/30 text-primary font-semibold rounded-lg hover:bg-surface-container-low transition-colors active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Journal entries list */}
          {journalEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-outline/30 text-6xl mb-4">menu_book</span>
              <p className="text-outline text-[14px] max-w-xs">No journal entries yet. Start writing to track your thoughts and expenses.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {journalEntries.map(entry => (
                <div key={entry.id} className="flex items-start gap-4 p-4 rounded-[12px] border border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-[12px] bg-surface-container text-outline flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-on-surface font-medium line-clamp-2">{entry.text}</p>
                    <p className="text-[12px] text-outline uppercase tracking-wider mt-1">{entry.date} • {entry.category}</p>
                  </div>
                  {entry.parsedAmount !== null && (
                    <span className="text-on-surface font-semibold text-[16px] shrink-0">-₹{entry.parsedAmount}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insight */}
        <div className="bg-primary/5 p-8 rounded-[16px] flex flex-col md:flex-row items-center gap-8 border border-primary/10">
          <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden shadow-sm">
            <img alt="Financial analysis" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM9tNdc2rcgQLFFdHVBsZMrgXXLxDAKi6iD-q3z7H7ijZAbo7lF6Tdnm2L-k7UAO3VRkp7eOljw5awEGTlZwT24McI09zxantzHFzm1nfFqpU08FDon0oRm1_2B7SwTA5iukHBbuRiKnjxRVaBquefsAXIz-ATw7U6xXZOVahNnstL_emGxws7cev2NBQ5qRakcRbxFXjCs3JpB6L01OFEyG9OU9p--vGxz5t_3RuU9bKaSbCsyIgSfYzLoFbdL22BVXMA6-m-R0QU"/>
          </div>
          <div className="flex-1">
            <span className="text-primary font-semibold text-[12px] uppercase tracking-wider">AI Insight</span>
            <h4 className="font-headline-md text-on-surface text-2xl mt-2 mb-4">You&apos;re on track to save ₹450 more this month!</h4>
            <p className="text-body-md text-outline mb-6">Based on your spending patterns in the &apos;Entertainment&apos; category, you are significantly below your usual average. Investing this surplus into your &apos;Tech Growth&apos; portfolio could yield an estimated 4% additional return by year-end.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setOptimizationApplied(true);
                  showToastMsg("✅ Optimization applied! ₹450 redirected to Tech Growth portfolio.");
                }}
                className={`px-6 py-2 rounded-lg font-semibold text-[14px] transition-colors active:scale-95 ${
                  optimizationApplied ? "bg-primary text-white" : "bg-primary text-white hover:opacity-90 shadow-[0_4px_20px_rgba(84,66,219,0.2)]"
                }`}
              >
                {optimizationApplied ? "✓ Applied!" : "Apply Optimization"}
              </button>
              <button
                onClick={() => showToastMsg("AI analysis: Entertainment spending is 62.5% below budget. Dining is 85% utilized. Consider reallocating unused Entertainment budget to accelerate your Emergency Fund.")}
                className="px-6 py-2 text-primary font-semibold text-[14px] hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant/30 bg-white shadow-sm"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Feature 3 — Transaction History (CSV) */}
        <div className="space-y-6">
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h2 className="font-display text-on-surface text-3xl">Transaction History</h2>
              <p className="text-body-lg text-outline">Three-month spending records</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-2">
                {months.map(m => (
                  <button
                    key={m}
                    onClick={() => setActiveMonth(m)}
                    className={`rounded-lg px-5 py-2 font-semibold text-[14px] transition-colors ${
                      activeMonth === m
                        ? "bg-primary text-white"
                        : "bg-white border border-outline-variant/30 text-outline hover:bg-surface-container-low"
                    }`}
                  >
                    {m.split(" ")[0]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowVisualize(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-[14px] rounded-lg hover:opacity-90 shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">bar_chart</span> Visualize Data
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container">
                  <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-outline">Date</th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-outline">Description</th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-outline">Category</th>
                  <th className="px-6 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-outline">Amount</th>
                </tr>
              </thead>
              <tbody>
                {csvData[activeMonth].map((row, i) => (
                  <tr key={i} className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 text-[13px] text-outline font-medium">{row.date}</td>
                    <td className="px-6 py-4 text-[14px] text-on-surface font-semibold">{row.name}</td>
                    <td className="px-6 py-4 text-[12px] text-outline uppercase tracking-wider">{row.category}</td>
                    <td className={`px-6 py-4 text-right font-semibold text-[14px] ${row.amount >= 0 ? "text-primary" : "text-on-surface"}`}>
                      {row.amount >= 0 ? `+₹${row.amount.toFixed(2)}` : `-₹${Math.abs(row.amount).toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 flex justify-end border-t border-outline-variant/20">
              <button
                onClick={() => handleDownloadCSV(activeMonth)}
                className="flex items-center gap-2 border border-outline-variant/30 text-primary font-semibold rounded-lg px-6 py-3 hover:bg-surface-container-low transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                Download {activeMonth} CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 1 — Set Income Modal */}
      {showSetIncome && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowSetIncome(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">Set Monthly Income</h3>
              <button onClick={() => setShowSetIncome(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Monthly Income (₹)</label>
                <input
                  type="number"
                  value={incomeForm}
                  onChange={e => setIncomeForm(e.target.value)}
                  placeholder="e.g. 35000"
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface"
                />
              </div>
              <button
                onClick={handleSetIncome}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-[16px] hover:opacity-90 shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all mt-2"
              >
                Save Income
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAddExpense(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">Add Expense</h3>
              <button onClick={() => setShowAddExpense(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Description</label>
                <input
                  type="text"
                  value={expenseForm.name}
                  onChange={e => setExpenseForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Uber ride"
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-outline text-on-surface"
                />
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-on-surface"
                >
                  <option>Dining</option>
                  <option>Groceries</option>
                  <option>Entertainment</option>
                  <option>Transportation</option>
                  <option>Housing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-outline text-on-surface"
                />
              </div>
              <button
                onClick={handleAddExpense}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-[16px] hover:opacity-90 shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all mt-2"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {showEditBudget && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowEditBudget(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">Edit Budget Limits</h3>
              <button onClick={() => setShowEditBudget(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              {budgets.map((b, i) => (
                <div key={i}>
                  <label className="flex items-center gap-2 font-semibold text-[14px] text-outline mb-2">
                    <span className="material-symbols-outlined text-primary text-sm">{b.icon}</span>
                    {b.category}
                  </label>
                  <input
                    type="number"
                    value={b.limit}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      setBudgets(prev => prev.map((x, j) => j === i ? { ...x, limit: val } : x));
                    }}
                    className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface"
                  />
                </div>
              ))}
              <button
                onClick={handleEditBudgetSave}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-[16px] hover:opacity-90 shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all mt-2"
              >
                Save Limits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Transactions Modal */}
      {showAllTransactions && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAllTransactions(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-2xl shadow-[0_12px_32px_rgba(120,118,129,0.08)] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">All Transactions</h3>
              <button onClick={() => setShowAllTransactions(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-[12px] border border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${tx.isIncome ? "bg-primary/10 text-primary" : "bg-surface-container text-outline"}`}>
                      <span className="material-symbols-outlined text-lg">{tx.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[16px] text-on-surface">{tx.name}</p>
                      <p className="text-[12px] font-semibold tracking-wider uppercase text-outline">{tx.date} • {tx.category}</p>
                    </div>
                  </div>
                  <p className={`font-semibold text-[16px] ${tx.isIncome ? "text-primary" : "text-on-surface"}`}>
                    {tx.isIncome ? "+" : ""}₹{Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature 3 — Visualize Data Modal */}
      {showVisualize && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowVisualize(false)}>
          <div className="bg-white rounded-[20px] p-8 w-full max-w-3xl shadow-[0_24px_64px_rgba(79,55,138,0.18)] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-headline-md text-on-surface text-2xl font-bold">Spending Analytics</h3>
                <p className="text-[13px] text-outline mt-1">3-month overview across all categories</p>
              </div>
              <button onClick={() => setShowVisualize(false)} className="p-2 hover:bg-surface-container rounded-xl transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>

            {/* ── Chart 1: Colourful Vertical Bar Graph ── */}
            <h4 className="font-semibold text-on-surface text-[16px] mb-1">📊 Monthly Spending</h4>
            <p className="text-[12px] text-outline mb-5">Total expenses per month</p>
            {(() => {
              const barColors = ["#7C3AED", "#06B6D4", "#F59E0B"];
              const barW = 64;
              const gap = 32;
              const chartH = 180;
              const svgW = monthTotals.length * (barW + gap) + gap;
              return (
                <div className="overflow-x-auto">
                  <svg width={svgW} height={chartH + 56} style={{ display: "block", margin: "0 auto" }}>
                    <defs>
                      {monthTotals.map((_, i) => (
                        <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={barColors[i % barColors.length]} stopOpacity="1" />
                          <stop offset="100%" stopColor={barColors[i % barColors.length]} stopOpacity="0.55" />
                        </linearGradient>
                      ))}
                    </defs>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((frac, gi) => (
                      <line
                        key={gi}
                        x1={gap / 2} y1={chartH - frac * chartH}
                        x2={svgW - gap / 2} y2={chartH - frac * chartH}
                        stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4"
                      />
                    ))}
                    {monthTotals.map(({ month, total }, i) => {
                      const barH = maxMonthTotal > 0 ? (total / maxMonthTotal) * chartH : 0;
                      const x = gap + i * (barW + gap);
                      const y = chartH - barH;
                      const color = barColors[i % barColors.length];
                      return (
                        <g key={month}>
                          <rect
                            x={x} y={y} width={barW} height={barH}
                            rx="8" ry="8"
                            fill={`url(#barGrad${i})`}
                            style={{ filter: `drop-shadow(0 4px 8px ${color}55)` }}
                          />
                          {/* Value label on top */}
                          <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
                            ₹{total.toFixed(0)}
                          </text>
                          {/* Month label below */}
                          <text x={x + barW / 2} y={chartH + 18} textAnchor="middle" fontSize="12" fontWeight="600" fill="#64748b">
                            {month.split(" ")[0]}
                          </text>
                          <text x={x + barW / 2} y={chartH + 34} textAnchor="middle" fontSize="10" fill="#94a3b8">
                            {month.split(" ")[1]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}

            {/* Legend for bar chart */}
            <div className="flex gap-6 mt-3 mb-8 flex-wrap">
              {monthTotals.map(({ month }, i) => {
                const barColors = ["#7C3AED", "#06B6D4", "#F59E0B"];
                return (
                  <div key={month} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: barColors[i % barColors.length] }} />
                    <span className="text-[12px] text-outline font-medium">{month}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-b border-outline-variant/20 mb-8" />

            {/* ── Chart 2: SVG Pie/Donut Chart ── */}
            <h4 className="font-semibold text-on-surface text-[16px] mb-1">🥧 Spending by Category</h4>
            <p className="text-[12px] text-outline mb-5">All-time category breakdown</p>
            {(() => {
              const pieColors = ["#7C3AED", "#06B6D4", "#F59E0B", "#10B981", "#F43F5E", "#8B5CF6", "#0EA5E9"];
              const grandTotal = categoryTotals.reduce((s, c) => s + c.total, 0);
              const cx = 110, cy = 110, r = 80, innerR = 48;
              let cumAngle = -Math.PI / 2;

              const slices = categoryTotals.map((c, i) => {
                const frac = grandTotal > 0 ? c.total / grandTotal : 0;
                const startAngle = cumAngle;
                const sweepAngle = frac * 2 * Math.PI;
                cumAngle += sweepAngle;
                const endAngle = cumAngle;

                const x1 = cx + r * Math.cos(startAngle);
                const y1 = cy + r * Math.sin(startAngle);
                const x2 = cx + r * Math.cos(endAngle);
                const y2 = cy + r * Math.sin(endAngle);
                const xi1 = cx + innerR * Math.cos(startAngle);
                const yi1 = cy + innerR * Math.sin(startAngle);
                const xi2 = cx + innerR * Math.cos(endAngle);
                const yi2 = cy + innerR * Math.sin(endAngle);
                const large = sweepAngle > Math.PI ? 1 : 0;
                const d = [
                  `M ${xi1} ${yi1}`,
                  `L ${x1} ${y1}`,
                  `A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
                  `L ${xi2} ${yi2}`,
                  `A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1}`,
                  "Z",
                ].join(" ");
                return { d, color: pieColors[i % pieColors.length], pct: Math.round(frac * 100), category: c.category, total: c.total };
              });

              return (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Donut SVG */}
                  <svg width={220} height={220} style={{ flexShrink: 0 }}>
                    <defs>
                      {slices.map((s, i) => (
                        <filter key={i} id={`pieGlow${i}`}>
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={s.color} floodOpacity="0.35" />
                        </filter>
                      ))}
                    </defs>
                    {slices.map((s, i) => (
                      <path
                        key={i}
                        d={s.d}
                        fill={s.color}
                        stroke="white"
                        strokeWidth="2"
                        style={{ filter: `url(#pieGlow${i})`, transition: "opacity 0.2s", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        <title>{s.category}: ₹{s.total.toFixed(0)} ({s.pct}%)</title>
                      </path>
                    ))}
                    {/* Centre label */}
                    <text x={cx} y={cy - 8} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">TOTAL</text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fontSize="15" fill="#1e293b" fontWeight="800">
                      ₹{grandTotal.toFixed(0)}
                    </text>
                  </svg>

                  {/* Legend */}
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    {slices.map((s, i) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                          <span className="text-[13px] font-semibold text-on-surface truncate">{s.category}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-20 h-1.5 rounded-full bg-surface-container overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                          </div>
                          <span className="text-[12px] font-bold w-8 text-right" style={{ color: s.color }}>{s.pct}%</span>
                          <span className="text-[12px] text-outline w-20 text-right">₹{s.total.toFixed(0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
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
