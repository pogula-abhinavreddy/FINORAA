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

export default function BudgetTracking() {
  const [transactions, setTransactions] = useState<Expense[]>(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ name: "", category: "Dining", amount: "" });
  const [toast, setToast] = useState<string | null>(null);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  const totalSpent = transactions.filter(t => !t.isIncome).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = 6200;
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
      </div>

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

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-3 animate-slide-up z-50 max-w-md border border-outline-variant/20">
          <span className="material-symbols-outlined shrink-0 text-primary">check_circle</span>
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
