"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" :
    hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="pt-10 px-sm md:px-lg lg:px-xl pb-32 md:pb-xl max-w-[1600px] w-full mx-auto">
      {/* Header Section */}
      <div className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-sm">
        <div>
          <h1 className="font-display text-display text-on-surface mb-base">{greeting}, {firstName}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Here is your financial intelligence briefing for today.</p>
        </div>
        <div className="flex gap-sm">
          <button className="flex items-center gap-xs px-sm py-xs rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant font-label-sm hover:-translate-y-[1px] transition-transform shadow-[0px_2px_8px_rgba(15,23,42,0.02)]">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Report
          </button>
          <button className="flex items-center gap-xs px-sm py-xs rounded-lg bg-primary text-on-primary font-label-sm hover:-translate-y-[1px] transition-transform shadow-[0px_4px_12px_rgba(79,55,138,0.2)]">
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Transaction
          </button>
        </div>
      </div>
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-gutter">
        {/* Health Score Card */}
        <div className="col-span-4 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">Financial Health</h2>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <div className="flex justify-center mb-md relative">
              {/* Simulated Progress Ring */}
              <div className="w-40 h-40 rounded-full border-8 border-surface-container relative flex items-center justify-center">
                <div className="absolute inset-[-8px] rounded-full border-8 border-primary border-t-transparent border-l-transparent transform rotate-45"></div>
                <div className="flex flex-col items-center">
                  <span className="font-display text-[40px] leading-none font-bold text-primary">84</span>
                  <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mt-1">Excellent</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-sm flex items-start gap-sm">
            <span className="material-symbols-outlined text-tertiary-container mt-1">trending_up</span>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface font-medium">Up 4 points this month</p>
              <p className="font-label-xs text-label-xs text-on-surface-variant">Your debt-to-income ratio improved by 2%.</p>
            </div>
          </div>
        </div>

        {/* Net Worth / Investment Snapshot */}
        <div className="col-span-4 md:col-span-8 lg:col-span-8 bg-surface-container-lowest rounded-2xl p-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/5 flex flex-col">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Net Worth</p>
              <h2 className="font-display text-display text-on-surface">₹1,42,500.00</h2>
              <div className="flex items-center gap-1 mt-1 text-primary">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                <span className="font-label-sm text-label-sm font-medium">+2.4% (₹3,420)</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant ml-1">vs last month</span>
              </div>
            </div>
            <div className="flex bg-surface-container-low rounded-lg p-1">
              <button className="px-3 py-1 font-label-xs text-label-xs rounded-md bg-surface-container-lowest shadow-sm text-on-surface font-medium">1M</button>
              <button className="px-3 py-1 font-label-xs text-label-xs text-on-surface-variant hover:text-on-surface transition-colors">6M</button>
              <button className="px-3 py-1 font-label-xs text-label-xs text-on-surface-variant hover:text-on-surface transition-colors">YTD</button>
            </div>
          </div>
          
          {/* Abstract Line Graph Area */}
          <div className="flex-1 w-full relative min-h-[150px]">
            <div className="absolute inset-0 flex flex-col justify-between pt-4">
              <div className="border-b border-outline-variant/10 w-full"></div>
              <div className="border-b border-outline-variant/10 w-full"></div>
              <div className="border-b border-outline-variant/10 w-full"></div>
              <div className="border-b border-outline-variant/10 w-full"></div>
            </div>
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f378a" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#4f378a" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,80 Q10,70 20,75 T40,60 T60,40 T80,30 T100,20 L100,100 L0,100 Z" fill="url(#gradient)"></path>
              <path d="M0,80 Q10,70 20,75 T40,60 T60,40 T80,30 T100,20" fill="none" stroke="#4f378a" strokeLinecap="round" strokeWidth="2"></path>
            </svg>
            <div className="absolute top-[20%] right-0 w-3 h-3 bg-white border-2 border-primary rounded-full shadow-[0_0_10px_rgba(79,55,138,0.5)]"></div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="col-span-4 md:col-span-8 lg:col-span-12 ai-border shadow-[0px_12px_32px_rgba(79,55,138,0.08)]">
          <div className="ai-border-inner p-md flex flex-col md:flex-row items-start md:items-center gap-md">
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[28px]">auto_awesome</span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">AI Insight: High Yield Opportunity</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Your checking account balance exceeds your typical monthly spend by ₹4,000. Moving this to your High-Yield Savings could earn you an estimated ₹180 annually.</p>
            </div>
            <div className="shrink-0 flex gap-sm mt-sm md:mt-0 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-sm py-xs rounded-lg border border-outline-variant/30 text-on-surface-variant font-label-sm hover:bg-surface-container-lowest transition-colors">Dismiss</button>
              <button className="flex-1 md:flex-none px-sm py-xs rounded-lg bg-primary text-on-primary font-label-sm hover:bg-primary/90 transition-colors shadow-sm">Transfer Funds</button>
            </div>
          </div>
        </div>

        {/* Savings Goals */}
        <div className="col-span-4 md:col-span-4 lg:col-span-6 bg-surface-container-lowest rounded-2xl p-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/5">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Savings Goals</h2>
            <button className="text-primary text-label-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="flex flex-col gap-md">
            <div>
              <div className="flex justify-between items-end mb-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-container/20 flex items-center justify-center text-tertiary-container">
                    <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium">Japan Trip 2025</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">₹3,500 / ₹5,000</span>
              </div>
              <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-container rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]">home</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium">House Down Payment</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">₹42,000 / ₹80,000</span>
              </div>
              <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: "52%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-span-4 md:col-span-4 lg:col-span-6 bg-surface-container-lowest rounded-2xl p-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/5">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h2>
            <button className="text-primary text-label-sm font-semibold hover:underline">See All</button>
          </div>
          <div className="flex flex-col gap-sm">
            <div className="flex items-center justify-between p-sm rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface font-medium">Whole Foods Market</p>
                  <p className="font-label-xs text-label-xs text-on-surface-variant">Groceries • Today, 10:42 AM</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">-₹142.50</span>
            </div>
            <div className="flex items-center justify-between p-sm rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface font-medium">Acme Corp Salary</p>
                  <p className="font-label-xs text-label-xs text-on-surface-variant">Income • Yesterday</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-semibold">+₹4,250.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
