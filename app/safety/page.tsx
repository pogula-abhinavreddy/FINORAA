"use client";
import { useState } from "react";

const initialActivity = [
  { action: "Login", device: "Chrome on Windows", time: "Oct 14, 10:24 AM", status: "Successful", icon: "login" },
  { action: "Password Change", device: "Safari on iPhone", time: "Sep 30, 04:12 PM", status: "Successful", icon: "password" },
  { action: "2FA Enabled", device: "System", time: "Aug 15, 09:00 AM", status: "Completed", icon: "verified_user" },
  { action: "Failed Login", device: "Firefox on MacOS", time: "Aug 12, 11:30 PM", status: "Blocked", icon: "report" },
];

export default function SafetyPage() {
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showRevokeModal, setShowRevokeModal] = useState<number | null>(null);

  const sessions = [
    { device: "Chrome on Windows", location: "Hyderabad, India", time: "Active now", current: true, ip: "192.168.1.45" },
    { device: "Safari on iPhone", location: "Hyderabad, India", time: "2 hours ago", current: false, ip: "103.21.54.12" },
    { device: "Firefox on MacOS", location: "Mumbai, India", time: "3 days ago", current: false, ip: "122.160.43.9" },
  ];

  const [activeSessions, setActiveSessions] = useState(sessions);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleRevoke() {
    if (showRevokeModal !== null) {
      setActiveSessions(prev => prev.filter((_, i) => i !== showRevokeModal));
      showToastMsg("Session revoked successfully. The device will be signed out.");
      setShowRevokeModal(null);
    }
  }

  return (
    <>
      <div className="p-10 max-w-5xl mx-auto space-y-10">
        <div>
          <h2 className="font-display text-3xl text-on-surface mb-2">Security & Privacy</h2>
          <p className="text-body-lg text-outline">Control your account protection and monitoring tools</p>
        </div>

        {/* Security Health Bento */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-primary p-10 rounded-[16px] text-white relative overflow-hidden shadow-[0_12px_32px_rgba(120,118,129,0.08)]">
            <div className="relative z-10">
              <div className="flex items-center gap-10">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary-fixed/20" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 * (1 - 0.85)} className="text-white" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold font-display">85%</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display mb-2 text-3xl">Security Score: <span className="text-white">Strong</span></h3>
                  <p className="text-white/80 text-body-md max-w-md">Your account is highly protected. Enable biometric authentication to reach a perfect 100% score.</p>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => { setBiometric(true); showToastMsg("Biometrics enabled! Score updated to 100%."); }}
                  className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:scale-105 transition-transform active:scale-95 text-[14px] shadow-sm"
                >
                  Boost Score
                </button>
                <button onClick={() => showToastMsg("Full security audit starting...")} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all text-[14px]">
                  Run Audit
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50"></div>
          </div>
          
          <div className="bg-white p-8 rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] flex flex-col justify-between">
            <div className="w-16 h-16 bg-primary/10 rounded-[12px] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">shield</span>
            </div>
            <div>
              <h4 className="font-display text-xl text-on-surface mb-2">Encryption</h4>
              <p className="text-[12px] font-semibold text-outline leading-relaxed">Your data is secured using AES-256 bank-grade encryption at rest and in transit.</p>
            </div>
            <span className="text-[12px] font-bold text-primary uppercase tracking-widest mt-4">Verified ✓</span>
          </div>
        </div>

        {/* Auth Toggles */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] p-8 space-y-2">
            <h3 className="font-display text-2xl text-on-surface mb-6">Authentication</h3>
            
            <div className="flex items-center justify-between py-5 border-b border-outline-variant/20 group cursor-pointer" onClick={() => setTwoFA(!twoFA)}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors ${twoFA ? "bg-primary/10 text-primary" : "bg-surface-container-low text-outline"}`}>
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-on-surface">2FA Protection</p>
                  <p className="text-[12px] font-semibold text-outline">Authenticator app or SMS</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all relative ${twoFA ? "bg-primary" : "bg-outline-variant"}`}>
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-sm ${twoFA ? "right-1" : "left-1"}`} />
              </div>
            </div>

            <div className="flex items-center justify-between py-5 border-b border-outline-variant/20 group cursor-pointer" onClick={() => setBiometric(!biometric)}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors ${biometric ? "bg-primary/10 text-primary" : "bg-surface-container-low text-outline"}`}>
                  <span className="material-symbols-outlined">fingerprint</span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-on-surface">Biometrics</p>
                  <p className="text-[12px] font-semibold text-outline">FaceID or Fingerprint</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all relative ${biometric ? "bg-primary" : "bg-outline-variant"}`}>
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-sm ${biometric ? "right-1" : "left-1"}`} />
              </div>
            </div>

            <div className="flex items-center justify-between py-5 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-low rounded-[12px] flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">key</span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-on-surface">Password</p>
                  <p className="text-[12px] font-semibold text-outline">Last changed 32 days ago</p>
                </div>
              </div>
              <button
                onClick={() => { setPasswordChanged(true); showToastMsg("Password reset secure link sent to your email."); }}
                className={`px-5 py-2.5 rounded-lg font-bold text-[14px] transition-all active:scale-95 ${passwordChanged ? "bg-primary/10 text-primary" : "bg-primary text-white hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)]"}`}
              >
                {passwordChanged ? "Reset Sent ✓" : "Update"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] p-8 space-y-2">
            <h3 className="font-display text-2xl text-on-surface mb-6">Privacy & Alerts</h3>
            
            <div className="flex items-center justify-between py-5 border-b border-outline-variant/20 group cursor-pointer" onClick={() => setLoginAlerts(!loginAlerts)}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors ${loginAlerts ? "bg-primary/10 text-primary" : "bg-surface-container-low text-outline"}`}>
                  <span className="material-symbols-outlined">devices</span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-on-surface">Login Alerts</p>
                  <p className="text-[12px] font-semibold text-outline">New device notifications</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all relative ${loginAlerts ? "bg-primary" : "bg-outline-variant"}`}>
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-sm ${loginAlerts ? "right-1" : "left-1"}`} />
              </div>
            </div>

            <div className="flex items-center justify-between py-5 border-b border-outline-variant/20 group cursor-pointer" onClick={() => setTransactionAlerts(!transactionAlerts)}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors ${transactionAlerts ? "bg-primary/10 text-primary" : "bg-surface-container-low text-outline"}`}>
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-on-surface">Activity Monitoring</p>
                  <p className="text-[12px] font-semibold text-outline">Alerts for large transfers</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all relative ${transactionAlerts ? "bg-primary" : "bg-outline-variant"}`}>
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-sm ${transactionAlerts ? "right-1" : "left-1"}`} />
              </div>
            </div>

            <div className="flex items-center justify-between py-5 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-low rounded-[12px] flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">visibility_off</span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-on-surface">Stealth Mode</p>
                  <p className="text-[12px] font-semibold text-outline">Hide balances in public</p>
                </div>
              </div>
              <button 
                onClick={() => showToastMsg("Stealth Mode enabled. Balances are now masked.")}
                className="px-5 py-2.5 rounded-lg font-bold text-[14px] border border-outline-variant/30 text-primary hover:bg-surface-container-low active:scale-95 transition-all"
              >
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Sessions & Activity */}
        <div className="grid grid-cols-12 gap-8">
          {/* Active Sessions */}
          <div className="col-span-7 bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] p-8">
            <h3 className="font-display text-2xl text-on-surface mb-6">Active Sessions</h3>
            <div className="space-y-4">
              {activeSessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-[12px] border border-outline-variant/20 hover:bg-surface-container-low transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-surface-container-low rounded-[12px] flex items-center justify-center group-hover:bg-white group-hover:shadow-[0_4px_20px_rgba(120,118,129,0.05)] transition-all">
                      <span className="material-symbols-outlined text-outline text-2xl">devices</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display text-[16px] text-on-surface">{s.device}</p>
                        {s.current && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Current</span>}
                      </div>
                      <p className="text-[12px] font-semibold text-outline">{s.location} · {s.time}</p>
                      <p className="text-[10px] text-outline font-mono mt-1">IP: {s.ip}</p>
                    </div>
                  </div>
                  {!s.current && (
                    <button
                      onClick={() => setShowRevokeModal(i)}
                      className="px-5 py-2 text-error font-bold text-xs rounded-lg border border-error/20 hover:bg-error/10 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                    >
                      Log out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Security Activity */}
          <div className="col-span-5 bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] p-8">
            <h3 className="font-display text-2xl text-on-surface mb-6">Security Log</h3>
            <div className="space-y-6">
              {initialActivity.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${a.status === "Blocked" ? "bg-error/10 text-error" : "bg-primary/10 text-primary"}`}>
                    <span className="material-symbols-outlined text-xl">{a.icon}</span>
                  </div>
                  <div className="flex-1 border-b border-outline-variant/20 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-[14px] text-on-surface">{a.action}</p>
                      <span className={`text-[12px] font-bold ${a.status === "Blocked" ? "text-error" : "text-primary"}`}>{a.status}</span>
                    </div>
                    <p className="text-[12px] font-semibold text-outline line-clamp-1">{a.device}</p>
                    <p className="text-[10px] text-outline mt-1">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      {showRevokeModal !== null && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowRevokeModal(null)}>
          <div className="bg-white rounded-[16px] p-10 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-error">logout</span>
            </div>
            <h3 className="font-display text-3xl text-center mb-4 text-on-surface">Revoke Session?</h3>
            <p className="text-center text-outline mb-8 leading-relaxed font-body-md">
              This will immediately sign out <strong className="text-on-surface font-semibold">{activeSessions[showRevokeModal].device}</strong>. You can sign back in at any time.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRevokeModal(null)}
                className="flex-1 py-4 border border-outline-variant/30 rounded-lg font-bold text-outline hover:bg-surface-container transition-all active:scale-95 text-[16px]"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                className="flex-1 py-4 bg-error text-white rounded-lg font-bold hover:shadow-[0_4px_20px_rgba(204,41,41,0.2)] transition-all active:scale-95 text-[16px]"
              >
                Yes, Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-3 animate-slide-up z-50 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
