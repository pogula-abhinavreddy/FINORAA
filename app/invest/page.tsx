"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const timeframes = ["1M", "3M", "1Y", "ALL"] as const;

const investmentData = [
  { name: "Ethereum", ticker: "ETH / USD", change: "+4.28%", holding: "3.402 ETH", value: "₹8,210.45", icon: "token", iconBg: "bg-emerald-50", iconText: "text-emerald-900", tag: "24H High", positive: true },
  { name: "Vanguard S&P 500", ticker: "VOO / ETF", change: "+1.12%", holding: "112.5 Shares", value: "₹48,920.10", icon: "apartment", iconBg: "bg-slate-50", iconText: "text-slate-700", tag: "Bullish", positive: true },
  { name: "Tesla Inc.", ticker: "TSLA / STOCKS", change: "-0.84%", holding: "45.0 Shares", value: "₹10,125.00", icon: "rocket_launch", iconBg: "bg-emerald-900", iconText: "text-white", tag: "Volatility: High", positive: false },
];

export default function InvestOverview() {
  const router = useRouter();
  const [activeTimeframe, setActiveTimeframe] = useState<typeof timeframes[number]>("1M");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showInvestmentDetail, setShowInvestmentDetail] = useState<number | null>(null);
  const [showAllPositions, setShowAllPositions] = useState(false);
  const [buyForm, setBuyForm] = useState({ asset: "ETH", amount: "" });
  const [sellForm, setSellForm] = useState({ asset: "ETH", amount: "" });
  const [toast, setToast] = useState<string | null>(null);
  const [tipDismissed, setTipDismissed] = useState(false);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleBuy() {
    if (!buyForm.amount.trim() || isNaN(parseFloat(buyForm.amount))) {
      showToastMsg("Please enter a valid amount");
      return;
    }
    showToastMsg(`✅ Order placed: Buy ₹${buyForm.amount} of ${buyForm.asset}`);
    setBuyForm({ asset: "ETH", amount: "" });
    setShowBuyModal(false);
  }

  function handleSell() {
    if (!sellForm.amount.trim() || isNaN(parseFloat(sellForm.amount))) {
      showToastMsg("Please enter a valid amount");
      return;
    }
    showToastMsg(`✅ Order placed: Sell ₹${sellForm.amount} of ${sellForm.asset}`);
    setSellForm({ asset: "ETH", amount: "" });
    setShowSellModal(false);
  }

  const balanceMap: Record<string, string> = {
    "1M": "₹124,592.80",
    "3M": "₹118,201.50",
    "1Y": "₹95,400.20",
    "ALL": "₹72,000.00",
  };

  const changeMap: Record<string, string> = {
    "1M": "+12.4% (₹14,201.12) this month",
    "3M": "+8.2% (₹8,940.55) this quarter",
    "1Y": "+38.6% (₹27,410.80) this year",
    "ALL": "+73.1% (₹52,592.80) all time",
  };

  return (
    <>
      <div className="p-container-padding max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-headline-xl text-on-surface mb-2 text-3xl">Portfolio Overview</h2>
            <p className="font-body-md text-outline">Track your financial journey and explore new growth opportunities.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSellModal(true)}
              className="flex items-center gap-2 bg-white border border-outline-variant/30 px-6 py-2.5 rounded-lg font-semibold text-[14px] text-primary hover:bg-surface-container-low active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined" data-icon="sell">sell</span>
              Sell
            </button>
            <button
              onClick={() => setShowBuyModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-8 py-2.5 rounded-lg font-semibold text-[14px] hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
              Buy Assets
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          {/* Chart */}
          <div className="col-span-8 bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-outline-variant/30">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="font-semibold text-[12px] text-outline uppercase tracking-wider mb-1">Total Balance</p>
                <h3 className="font-display text-4xl text-on-surface">{balanceMap[activeTimeframe]}</h3>
                <div className="flex items-center gap-2 text-primary font-semibold text-[14px] mt-1">
                  <span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
                  <span>{changeMap[activeTimeframe]}</span>
                </div>
              </div>
              <div className="flex bg-surface-container rounded-lg p-1">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                      activeTimeframe === tf
                        ? "bg-white shadow-sm text-primary"
                        : "text-outline hover:text-primary"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-[320px] w-full bg-gradient-to-b from-primary/10 to-transparent rounded-[12px] overflow-hidden flex items-end">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
                <path d="M0,250 C100,230 200,260 300,180 C400,100 500,120 600,60 C700,20 800,40 800,40 V300 H0 Z" fill="url(#grad1)"></path>
                <path d="M0,250 C100,230 200,260 300,180 C400,100 500,120 600,60 C700,20 800,40 800,40" fill="transparent" stroke="#5442DB" strokeLinecap="round" strokeWidth="4"></path>
                <defs>
                  <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#5442DB" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#5442DB" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-10 left-1/2 h-16 w-px bg-primary/50"></div>
              <div className="absolute bottom-28 left-[calc(50%-45px)] bg-primary text-white text-[10px] px-2 py-1 rounded-md font-bold">
                Peak: +18.2%
              </div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="col-span-4 bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-outline-variant/30 flex flex-col">
            <h4 className="font-headline-md text-xl text-on-surface mb-6">Asset Allocation</h4>
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="relative flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-[12px] border-primary border-r-primary/60 border-b-primary/30 border-t-primary/80 transform -rotate-45"></div>
                <div className="absolute flex flex-col items-center">
                  <span className="font-semibold text-[12px] text-outline">Diversification</span>
                  <span className="font-headline-lg text-primary text-2xl">8.2/10</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Stocks", pct: "64%", color: "bg-primary" },
                  { label: "Crypto", pct: "18%", color: "bg-primary/80" },
                  { label: "Bonds", pct: "12%", color: "bg-primary/60" },
                  { label: "Cash", pct: "6%", color: "bg-primary/30" },
                ].map(a => (
                  <div key={a.label} className="flex items-center justify-between cursor-pointer hover:bg-surface-container-low rounded-lg px-2 py-1 transition-colors" onClick={() => showToastMsg(`${a.label}: ${a.pct} of portfolio`)}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${a.color}`}></div>
                      <span className="font-semibold text-[14px] text-on-surface">{a.label}</span>
                    </div>
                    <span className="font-semibold text-[14px] text-on-surface">{a.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Investments */}
          <div className="col-span-12 mt-4">
            <div className="flex items-center justify-between mb-6 px-2">
              <h4 className="font-headline-md text-xl text-on-surface">Active Investments</h4>
              <button
                onClick={() => setShowAllPositions(true)}
                className="text-primary font-semibold text-[14px] hover:underline"
              >
                View All Positions
              </button>
            </div>
            <div className="grid grid-cols-3 gap-gutter">
              {investmentData.map((inv, i) => (
                <div
                  key={i}
                  onClick={() => setShowInvestmentDetail(i)}
                  className="bg-white p-5 rounded-[16px] border border-outline-variant/30 shadow-sm hover:shadow-[0_4px_20px_rgba(120,118,129,0.05)] transition-shadow group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center text-primary group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined">{inv.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[16px] text-on-surface">{inv.name}</p>
                        <p className="text-[12px] text-outline font-semibold">{inv.ticker}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-[14px] ${inv.positive ? "text-primary" : "text-error"}`}>{inv.change}</p>
                      <p className="text-[10px] text-outline/80 font-bold uppercase tracking-widest">{inv.tag}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-outline-variant/30 pt-4">
                    <div>
                      <p className="text-[12px] text-outline font-semibold">Holding</p>
                      <p className="font-headline-md text-[20px] text-on-surface">{inv.holding}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-outline font-semibold">Value</p>
                      <p className="font-semibold text-[16px] text-primary">{inv.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip Banner */}
          {!tipDismissed && (
            <div className="col-span-12 mt-6 relative h-56 rounded-[24px] overflow-hidden group">
              <img className="w-full h-full object-cover" alt="Investment tip banner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8yAKfHkJy_mkdY1jM7gbb1UL1EMr2dValWtGmwO6SnNLm4I36NuciqsiJI_xvJpsrdaABEdle-iV6FyZdA9qVMNWvzQkMYF_0gzOlBzWHDsAGnuBqkVfgNHethoqV-8EPLXIVln6SsgSlj6gaUCx2hHbEWghK-uArZ1zBYbMArYoynumv5FOeiV-T7tzTqgjUUiIYeiCK8xAuxN-BJSsXmhlt1xJWGsNvPa60HH-062lVVsPZ47aRw1SYy2UHz0YTPDaxQszl_UJk"/>
              <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface/90 to-transparent flex flex-col justify-center px-12 text-white">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-4">Investment Pro Tip</span>
                <h3 className="text-3xl font-display mb-4 max-w-md">Diversify your portfolio with ESG-compliant green energy bonds.</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => { router.push("/dashboard"); showToastMsg("Opening ESG Bonds lesson..."); }}
                    className="bg-white text-primary px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-colors active:scale-95"
                  >
                    Start Lesson
                  </button>
                  <button
                    onClick={() => setTipDismissed(true)}
                    className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-white/30 transition-colors active:scale-95"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 px-10 py-8 bg-surface-container border-t border-outline-variant/30 -mx-10 -mb-10">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-outline uppercase tracking-widest">Portfolio Health</span>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-primary rounded-full"></div>
                  </div>
                  <span className="font-semibold text-[14px] text-primary">Excellent</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-outline uppercase tracking-widest">Learning Progress</span>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary/60 rounded-full"></div>
                  </div>
                  <span className="font-semibold text-[14px] text-on-surface">Level 4</span>
                </div>
              </div>
            </div>
            <div className="text-outline text-[12px] font-medium">
              © 2024 Finora Financial Corp. All investments carry risk.
            </div>
          </div>
        </footer>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowBuyModal(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">Buy Assets</h3>
              <button onClick={() => setShowBuyModal(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Asset</label>
                <select
                  value={buyForm.asset}
                  onChange={e => setBuyForm(p => ({ ...p, asset: e.target.value }))}
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none bg-white text-on-surface"
                >
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="VOO">Vanguard S&P 500 (VOO)</option>
                  <option value="TSLA">Tesla Inc. (TSLA)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="AAPL">Apple Inc. (AAPL)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={buyForm.amount}
                  onChange={e => setBuyForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="Enter amount"
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none placeholder-outline text-on-surface"
                />
              </div>
              <button onClick={handleBuy} className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-[16px] hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all mt-2">
                Place Buy Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowSellModal(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">Sell Assets</h3>
              <button onClick={() => setShowSellModal(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Asset</label>
                <select
                  value={sellForm.asset}
                  onChange={e => setSellForm(p => ({ ...p, asset: e.target.value }))}
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none bg-white text-on-surface"
                >
                  <option value="ETH">Ethereum (3.402 ETH)</option>
                  <option value="VOO">Vanguard S&P 500 (112.5 Shares)</option>
                  <option value="TSLA">Tesla Inc. (45 Shares)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={sellForm.amount}
                  onChange={e => setSellForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="Enter amount"
                  className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none placeholder-outline text-on-surface"
                />
              </div>
              <button onClick={handleSell} className="w-full py-3 bg-error text-white rounded-lg font-semibold text-[16px] hover:shadow-[0_4px_20px_rgba(186,26,26,0.2)] active:scale-95 transition-all mt-2">
                Place Sell Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investment Detail Modal */}
      {showInvestmentDetail !== null && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowInvestmentDetail(null)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">{investmentData[showInvestmentDetail].name}</h3>
              <button onClick={() => setShowInvestmentDetail(null)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-[12px]">
                  <p className="text-[12px] font-semibold text-outline mb-1">Current Value</p>
                  <p className="font-headline-md text-primary">{investmentData[showInvestmentDetail].value}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-[12px]">
                  <p className="text-[12px] font-semibold text-outline mb-1">24h Change</p>
                  <p className={`font-headline-md ${investmentData[showInvestmentDetail].positive ? "text-primary" : "text-error"}`}>
                    {investmentData[showInvestmentDetail].change}
                  </p>
                </div>
              </div>
              <div className="p-4 border border-outline-variant/30 rounded-[12px]">
                <p className="text-[12px] font-semibold text-outline mb-1">Holdings</p>
                <p className="font-semibold text-[14px] text-on-surface">{investmentData[showInvestmentDetail].holding}</p>
              </div>
              <div className="p-4 border border-outline-variant/30 rounded-[12px]">
                <p className="text-[12px] font-semibold text-outline mb-1">Ticker</p>
                <p className="font-semibold text-[14px] text-on-surface">{investmentData[showInvestmentDetail].ticker}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowInvestmentDetail(null); setShowBuyModal(true); }}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold text-[16px] hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all"
                >
                  Buy More
                </button>
                <button
                  onClick={() => { setShowInvestmentDetail(null); setShowSellModal(true); }}
                  className="flex-1 py-3 border border-error text-error rounded-lg font-semibold text-[16px] hover:bg-error/10 active:scale-95 transition-all"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Positions Modal */}
      {showAllPositions && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAllPositions(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-2xl shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">All Positions</h3>
              <button onClick={() => setShowAllPositions(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-3">
              {[...investmentData,
                { name: "Bitcoin", ticker: "BTC / USD", change: "+2.14%", holding: "0.85 BTC", value: "₹28,900.00", icon: "currency_bitcoin", iconBg: "bg-primary/10", iconText: "text-primary", tag: "Stable", positive: true },
                { name: "Apple Inc.", ticker: "AAPL / STOCKS", change: "+0.67%", holding: "30 Shares", value: "₹5,250.00", icon: "phone_iphone", iconBg: "bg-surface-container-low", iconText: "text-outline", tag: "Steady", positive: true },
              ].map((inv, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-[12px] border border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer" onClick={() => showToastMsg(`${inv.name}: ${inv.value} (${inv.change})`)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-primary/10 rounded-[12px] flex items-center justify-center text-primary`}>
                      <span className="material-symbols-outlined">{inv.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[16px] text-on-surface">{inv.name}</p>
                      <p className="text-[12px] font-semibold text-outline">{inv.ticker}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[16px] text-on-surface">{inv.value}</p>
                    <p className={`text-[12px] font-semibold ${inv.positive ? "text-primary" : "text-error"}`}>{inv.change}</p>
                  </div>
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
