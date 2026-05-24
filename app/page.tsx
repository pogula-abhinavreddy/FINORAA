"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col relative">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-md border-b border-outline-variant/10 shadow-sm">
        <div className="flex justify-between items-center px-lg py-xs max-w-container-max mx-auto">
          <div className="font-display text-headline-lg font-bold text-primary cursor-pointer">
            FinSight
          </div>
          <div className="hidden md:flex items-center gap-lg">
            <button className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300">Features</button>
            <button className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300">Pricing</button>
            <button className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300">Company</button>
          </div>
          <div className="flex items-center gap-md">
            <button 
              className="hidden md:block text-primary font-label-sm hover:opacity-80 transition-opacity" 
              onClick={() => router.push("/login")}
            >
              Log In
            </button>
            <button 
              className="bg-primary text-on-primary px-md py-xs rounded-full font-label-sm hover:-translate-y-[1px] shadow-[0px_4px_20px_rgba(15,23,42,0.05)] transition-all duration-300 active:scale-95" 
              onClick={() => router.push("/login")}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-[88px] relative z-10"> {/* Offset for fixed nav */}
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-xl pb-xl px-sm md:px-lg lg:px-lg max-w-container-max mx-auto flex flex-col items-center text-center mt-xl">
          {/* Background glow element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/20 rounded-full blur-[100px] -z-10"></div>
          
          <div className="inline-flex items-center gap-xs px-sm py-xs bg-surface-container-high rounded-full border border-outline-variant/20 mb-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
            <span className="material-symbols-outlined text-[16px] text-primary" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-sm text-on-surface-variant">Introducing FinSight AI 2.0</span>
          </div>
          
          <h1 className="font-display text-display text-on-surface max-w-[800px] mb-md leading-[1.1]">
            Quiet Intelligence for Your Wealth
          </h1>
          
          <p className="font-body-lg text-on-surface-variant max-w-[600px] mb-xl">
            Experience the next generation of financial management. Precise analytics, AI-driven insights, and a remarkably clear interface to guide your financial future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-md items-center z-10">
            <button 
              onClick={() => router.push("/login")}
              className="bg-primary text-on-primary px-xl py-sm rounded-full font-label-sm shadow-[0px_12px_32px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-transform duration-300 w-full sm:w-auto"
            >
              Start Your Journey
            </button>
            <button 
              className="bg-surface/80 text-on-surface border border-outline-variant/30 px-xl py-sm rounded-full font-label-sm shadow-[0px_4px_20px_rgba(15,23,42,0.05)] backdrop-blur-md hover:-translate-y-1 transition-transform duration-300 w-full sm:w-auto flex items-center justify-center gap-xs"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Watch Demo
            </button>
          </div>
        </section>

        {/* Product Mockup & Floating Cards Area */}
        <section className="px-sm md:px-lg max-w-container-max mx-auto pb-xl relative">
          <div className="relative w-full max-w-[1000px] mx-auto">
            {/* Main Product Image */}
            <div className="rounded-[24px] overflow-hidden shadow-[0px_24px_64px_rgba(15,23,42,0.1)] border border-outline-variant/10 relative z-10 bg-white aspect-[16/9]">
              <img 
                alt="FinSight Dashboard Mockup" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOUPMfgFcu4HAw6zMNM0YoXzMzzIKXnOISipDg3Ouji3uMtfbQ2EUd8WCZDq2SvkaUFvjIfWr0xbTCz1dNwOp-tYc7LT1HdAN_3EKCpkdglU90Fv4F-k4bhTk22u9JlsDrtk1aPtw3wIkNNuGplaJWgnXdXg52QBeAt-bwi9XwQJOqwJbSHLRXl_itxA6sNXCD-3jFnBdVFUzQ04sBqNb2qJkAK7G4AqQROIDKvb8osA4d_ES_yIuU8pViAiKjxbiL-OYKftfk-Q"
              />
            </div>
            
            {/* Floating Card 1: Smart Budgeting */}
            <div className="hidden md:flex absolute -left-lg top-1/4 bg-white/80 backdrop-blur-xl border border-outline-variant/20 p-md rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.08)] z-20 flex-col gap-sm w-[240px] hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              </div>
              <div>
                <h3 className="font-label-sm text-on-surface">Smart Budgeting</h3>
                <p className="font-label-xs text-on-surface-variant mt-1">AI automatically categorizes and predicts your monthly spend.</p>
              </div>
              <div className="h-1 w-full bg-surface-variant rounded-full overflow-hidden mt-xs">
                <div className="h-full bg-primary w-[70%] rounded-full"></div>
              </div>
            </div>
            
            {/* Floating Card 2: Investment Insights */}
            <div className="hidden md:flex absolute -right-lg bottom-1/4 bg-white/80 backdrop-blur-xl border border-outline-variant/20 p-md rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.08)] z-20 flex-col gap-sm w-[240px] border-l-2 border-l-secondary hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
                </div>
                <span className="font-label-xs text-primary bg-primary-container/10 px-2 py-1 rounded-full">+12.4%</span>
              </div>
              <div>
                <h3 className="font-label-sm text-on-surface">Investment Insights</h3>
                <p className="font-label-xs text-on-surface-variant mt-1">Portfolio analysis reveals hidden optimization opportunities.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
