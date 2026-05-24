"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

// ─── Inner layout (has access to auth context) ────────────────────────────────
function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAuthPage = pathname === "/" || pathname === "/login";

  // Protect all non-auth pages
  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.replace("/login");
    }
  }, [user, loading, isAuthPage, router]);

  // Redirect logged-in users away from login/landing
  useEffect(() => {
    if (!loading && user && isAuthPage) {
      router.replace("/dashboard");
    }
  }, [user, loading, isAuthPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">
            progress_activity
          </span>
          <p className="text-on-surface-variant font-body-md">Loading FinSight…</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (!user) return null; // Redirect happening

  return (
    <>
      <Sidebar />
      <main className="ml-[280px] min-h-screen">
        <Header />
        {children}
      </main>
    </>
  );
}

// ─── Root wrapper (provides auth context to entire app) ───────────────────────
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}
