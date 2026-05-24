"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Tab = "signin" | "signup";

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  function friendlyError(code: string) {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (forgotMode) {
        await resetPassword(email);
        setInfo("Password reset email sent! Check your inbox.");
        setForgotMode(false);
      } else if (tab === "signin") {
        await signIn(email, password);
      } else {
        if (!name.trim()) { setError("Please enter your full name."); setLoading(false); return; }
        await signUp(email, password, name);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex w-1/2 bg-surface-container relative overflow-hidden flex-col justify-between p-lg">
        <div className="absolute inset-0 z-0">
          <img
            alt="FinSight Abstract Intelligence"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9_nyMkZRFrTbcGa9MtZZkTHD3SUJt2utSEFt6Xhf49OwaTxX9Stv9UycUSkukj13LkdoyHXYSmTYRTGiUt2UD-qS5-kJoe2HbHIo3ODMKZ2UUFp4V9CiJcWN5-Ey73QQfFD6PcOQIxHIi9Cxv3S7hMIDUcMp7QCy-ROkKlDEsWEoCWZ-0pmDS7RNZksGba28XhPvu_sIk8M5kBWCVMyNLlMgeYfUwjRBFn3eK0552VMR69HDByByW2eTkhC31DTrSa7wp4c9_Cw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container/20 to-surface-container/90 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-headline-lg font-bold text-primary flex items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            FinSight
          </h1>
        </div>
        <div className="relative z-10 max-w-md">
          <div className="bg-surface/60 backdrop-blur-md border border-outline-variant/20 p-md rounded-xl shadow-[0px_12px_32px_rgba(15,23,42,0.08)]">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Quiet Intelligence for Modern Finance</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Experience the next generation of financial clarity — minimalist design meets powerful AI insights.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-sm md:p-lg bg-surface relative">
        {/* Mobile brand */}
        <div className="absolute top-md left-md lg:hidden">
          <h1 className="font-display text-headline-lg-mobile font-bold text-primary flex items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            FinSight
          </h1>
        </div>

        <div className="w-full max-w-md">
          {/* Tabs */}
          {!forgotMode && (
            <>
              <div className="flex rounded-xl overflow-hidden border border-outline-variant/30 mb-lg">
                {(["signin", "signup"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(""); setInfo(""); }}
                    className={`flex-1 py-xs font-label-sm text-label-sm transition-all duration-300 ${
                      tab === t
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {t === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <div className="text-center mb-lg">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                  {tab === "signin" ? "Welcome back" : "Join FinSight"}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {tab === "signin"
                    ? "Sign in to access your financial dashboard."
                    : "Create your free account and take control of your finances."}
                </p>
              </div>
            </>
          )}

          {forgotMode && (
            <div className="text-center mb-lg">
              <span className="material-symbols-outlined text-5xl text-primary mb-sm block">lock_reset</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Reset Password</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>
          )}

          {/* Error / Info banners */}
          {error && (
            <div className="mb-md flex items-center gap-xs bg-error-container/20 border border-error/30 text-error rounded-lg px-sm py-xs">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <p className="font-label-sm text-label-sm">{error}</p>
            </div>
          )}
          {info && (
            <div className="mb-md flex items-center gap-xs bg-primary/10 border border-primary/30 text-primary rounded-lg px-sm py-xs">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <p className="font-label-sm text-label-sm">{info}</p>
            </div>
          )}

          <form className="space-y-md" onSubmit={handleSubmit}>
            {/* Name field (sign-up only) */}
            {tab === "signup" && !forgotMode && (
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-base" htmlFor="name">Full name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">person</span>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required={tab === "signup"}
                    className="w-full pl-xl pr-sm py-xs bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-base" htmlFor="email">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-xl pr-sm py-xs bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>
            </div>

            {/* Password (hidden in forgot mode) */}
            {!forgotMode && (
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-base" htmlFor="password">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">lock</span>
                  </div>
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-xl pr-xl py-xs bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-sm flex items-center text-outline hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">{showPass ? "visibility" : "visibility_off"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Forgot password link (sign-in only) */}
            {tab === "signin" && !forgotMode && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setForgotMode(true); setError(""); setInfo(""); }}
                  className="font-label-sm text-label-sm text-primary hover:opacity-80 transition-opacity"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-xs py-xs px-md border border-transparent rounded-lg shadow-sm font-label-sm text-label-sm text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:-translate-y-[1px] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
              {forgotMode ? "Send Reset Link" : tab === "signin" ? "Sign In" : "Create Account"}
            </button>

            {forgotMode && (
              <button
                type="button"
                onClick={() => { setForgotMode(false); setError(""); setInfo(""); }}
                className="w-full text-center font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                ← Back to sign in
              </button>
            )}
          </form>

          {/* Google sign-in */}
          {!forgotMode && (
            <div className="mt-lg">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-sm bg-surface font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">Or continue with</span>
                </div>
              </div>
              <div className="mt-md">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogle}
                  className="w-full flex justify-center items-center gap-sm py-xs px-md border border-outline-variant rounded-lg shadow-sm bg-surface-container-lowest font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  Sign {tab === "signin" ? "in" : "up"} with Google
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
