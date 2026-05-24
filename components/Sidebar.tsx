"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/budget', icon: 'account_balance_wallet', label: 'Budget Hub' },
  { href: '/invest', icon: 'trending_up', label: 'Investments' },
  { href: '/learn', icon: 'school', label: 'Financial Literacy' },
  { href: '/assistant', icon: 'smart_toy', label: 'AI Assistant' },
  { href: '/statements', icon: 'receipt_long', label: 'Accounts & Transactions' },
  { href: '/alerts', icon: 'notifications', label: 'Alerts' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] border-r border-outline-variant/30 flex flex-col py-8 px-4 z-40 shadow-[0_4px_20px_rgba(120,118,129,0.05)] backdrop-blur-md bg-white/70">
      <div className="mb-10 px-4">
        <Link href="/">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight font-display hover:text-primary transition-colors cursor-pointer">Finora</h1>
        </Link>
        <p className="text-outline font-label-sm uppercase tracking-widest mt-1">Financial Growth</p>
      </div>
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary'
                  : 'text-outline hover:text-on-surface hover:bg-surface-variant/50'
              }`}
            >
              <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
              <span className="font-label-sm text-[14px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-8 border-t border-outline-variant/30 px-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary/20">
            <span className="material-symbols-outlined text-primary" data-icon="account_circle">account_circle</span>
          </div>
          <div>
            <p className="text-on-surface font-label-sm text-[14px]">Level 14</p>
            <p className="text-outline text-label-xs">Senior Saver</p>
          </div>
        </div>
        <div className="space-y-1">
          <Link className="flex items-center gap-3 py-2 text-outline hover:text-on-surface transition-all rounded-lg px-2 hover:bg-surface-variant/50" href="/settings">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
            <span className="font-label-sm text-[14px]">Settings</span>
          </Link>
          <Link className="flex items-center gap-3 py-2 text-outline hover:text-on-surface transition-all rounded-lg px-2 hover:bg-surface-variant/50" href="/help">
            <span className="material-symbols-outlined" data-icon="help">help</span>
            <span className="font-label-sm text-[14px]">Help</span>
          </Link>
          <Link className="flex items-center gap-3 py-2 text-outline hover:text-error transition-all rounded-lg px-2 hover:bg-error/10 mt-2" href="/login">
            <span className="material-symbols-outlined" data-icon="logout">logout</span>
            <span className="font-label-sm text-[14px]">Log Out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
