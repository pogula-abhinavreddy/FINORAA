"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/firestore";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
  const { user, profile, logOut } = useAuth();
  const router_placeholder = typeof window !== "undefined" ? window.location : null;
  void router_placeholder;

  // ── Local editable state seeded from Firebase ──────────────────────────────
  const [tempName, setTempName] = useState(user?.displayName ?? "");
  const [tempBio, setTempBio] = useState(profile?.bio ?? "");
  const [tempPhone, setTempPhone] = useState(profile?.phone ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [prefs, setPrefs] = useState({
    currency: profile?.currency ?? "INR",
    language: profile?.language ?? "English",
    darkMode: false,
    emailNotifs: profile?.emailNotifs ?? true,
    pushNotifs: profile?.pushNotifs ?? true,
    weeklyDigest: profile?.weeklyDigest ?? false,
  });

  const [toast, setToast] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Re-seed when profile loads from Firestore
  useEffect(() => {
    if (profile) {
      setTempBio(profile.bio ?? "");
      setTempPhone(profile.phone ?? "");
      setPrefs(p => ({
        ...p,
        currency: profile.currency ?? p.currency,
        language: profile.language ?? p.language,
        emailNotifs: profile.emailNotifs ?? p.emailNotifs,
        pushNotifs: profile.pushNotifs ?? p.pushNotifs,
        weeklyDigest: profile.weeklyDigest ?? p.weeklyDigest,
      }));
    }
    if (user?.displayName) setTempName(user.displayName);
  }, [profile, user]);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleProfileSave() {
    if (!user) return;
    setSaving(true);
    try {
      // Update Firebase Auth display name
      await updateProfile(auth.currentUser!, { displayName: tempName });
      // Update Firestore profile
      await updateUserProfile(user.uid, { displayName: tempName, bio: tempBio, phone: tempPhone });
      setIsEditing(false);
      showToastMsg("Profile updated successfully!");
    } catch {
      showToastMsg("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleProfileDiscard() {
    setTempName(user?.displayName ?? "");
    setTempBio(profile?.bio ?? "");
    setTempPhone(profile?.phone ?? "");
    setIsEditing(false);
    showToastMsg("Changes discarded");
  }

  async function handlePrefToggle(key: "emailNotifs" | "pushNotifs" | "weeklyDigest" | "darkMode") {
    if (key === "darkMode") {
      showToastMsg("Dark mode coming soon!");
      return;
    }
    const newVal = !prefs[key];
    setPrefs(p => ({ ...p, [key]: newVal }));
    if (user) {
      await updateUserProfile(user.uid, { [key]: newVal });
    }
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
    showToastMsg(`${label} ${newVal ? "enabled" : "disabled"}`);
  }

  async function handleCurrencyChange(currency: string) {
    setPrefs(p => ({ ...p, currency }));
    if (user) await updateUserProfile(user.uid, { currency });
    showToastMsg(`Currency updated to ${currency}`);
  }

  async function handleLanguageChange(language: string) {
    setPrefs(p => ({ ...p, language }));
    if (user) await updateUserProfile(user.uid, { language });
    showToastMsg(`Language updated to ${language}`);
  }

  const avatarLetter = (user?.displayName ?? user?.email ?? "U")[0].toUpperCase();

  return (
    <>
      <div className="p-10 max-w-5xl mx-auto space-y-10">
        <div>
          <h2 className="font-display text-3xl text-on-surface mb-2">Account Settings</h2>
          <p className="text-body-lg text-outline">Manage your personal information and application preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] overflow-hidden">
          <div className="bg-primary h-32 relative">
            <div className="absolute -bottom-12 left-10">
              <div className="w-24 h-24 rounded-[16px] bg-white p-1 shadow-[0_4px_20px_rgba(120,118,129,0.1)]">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full rounded-[12px] object-cover" />
                ) : (
                  <div className="w-full h-full rounded-[12px] bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                    {avatarLetter}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 right-10 flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg transition-all border border-white/20 active:scale-95 text-[14px]"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleProfileDiscard}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg transition-all border border-white/20 active:scale-95 text-[14px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={saving}
                    className="px-6 py-2 bg-white text-primary font-bold rounded-lg hover:scale-105 transition-transform active:scale-95 shadow-sm text-[14px] disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="pt-16 pb-10 px-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[12px] font-semibold text-outline uppercase tracking-wider mb-2">Display Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={e => setTempName(e.target.value)}
                      className="w-full border-b border-primary py-2 font-display text-2xl outline-none text-on-surface"
                    />
                  ) : (
                    <p className="font-display text-2xl text-on-surface">{user?.displayName ?? "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-outline uppercase tracking-wider mb-2">Email Address</label>
                  <p className="font-body-md text-on-surface">{user?.email}</p>
                  <p className="text-[11px] text-outline mt-1">Email cannot be changed here for security reasons.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[12px] font-semibold text-outline uppercase tracking-wider mb-2">Level & XP</label>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest">
                      Level {profile?.level ?? 1}
                    </span>
                    <span className="text-[14px] font-semibold text-outline">{profile?.xp ?? 0} XP</span>
                  </div>
                  {/* XP Progress bar */}
                  <div className="mt-2 h-2 bg-surface-container rounded-full overflow-hidden w-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${((profile?.xp ?? 0) % 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-outline mt-1">{(profile?.xp ?? 0) % 100} / 100 XP to next level</p>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-outline uppercase tracking-wider mb-2">Bio / Motivation</label>
                  {isEditing ? (
                    <textarea
                      value={tempBio}
                      onChange={e => setTempBio(e.target.value)}
                      rows={2}
                      placeholder="Share your financial goal…"
                      className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none resize-none text-on-surface"
                    />
                  ) : (
                    <p className="font-body-md text-outline italic">&ldquo;{profile?.bio || "No bio yet — click Edit Profile to add one."}&rdquo;</p>
                  )}
                </div>
                {isEditing && (
                  <div>
                    <label className="block text-[12px] font-semibold text-outline uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="tel"
                      value={tempPhone}
                      onChange={e => setTempPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none text-on-surface"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences & Notifications */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-7 space-y-8">
            <div className="bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] p-8 space-y-6">
              <h3 className="font-display text-2xl text-on-surface">App Preferences</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-[14px] text-outline mb-2">Default Currency</label>
                  <select
                    value={prefs.currency}
                    onChange={e => handleCurrencyChange(e.target.value)}
                    className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none bg-white text-on-surface"
                  >
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="INR">INR — Indian Rupee</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[14px] text-outline mb-2">Interface Language</label>
                  <select
                    value={prefs.language}
                    onChange={e => handleLanguageChange(e.target.value)}
                    className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none bg-white text-on-surface"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="Hindi">हिन्दी</option>
                  </select>
                </div>
              </div>
              <div
                className="flex items-center justify-between py-5 border-t border-outline-variant/20 group cursor-pointer"
                onClick={() => handlePrefToggle("darkMode")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-low rounded-[12px] flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">dark_mode</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-on-surface">Appearance</p>
                    <p className="text-[12px] font-semibold text-outline">Toggle dark mode theme</p>
                  </div>
                </div>
                <div className={`w-14 h-8 rounded-full transition-all relative ${prefs.darkMode ? "bg-primary" : "bg-outline-variant"}`}>
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-sm ${prefs.darkMode ? "right-1" : "left-1"}`} />
                </div>
              </div>
            </div>

            {/* Sign Out & Danger Zone */}
            <div className="space-y-4">
              <button
                onClick={async () => { await logOut(); window.location.href = "/login"; }}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-[16px] border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container transition-colors font-semibold text-[14px]"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
              <div className="bg-error/10 rounded-[16px] border border-error/20 p-8 flex items-center justify-between">
                <div>
                  <h4 className="font-display text-xl text-error mb-1">Danger Zone</h4>
                  <p className="text-[12px] font-semibold text-error/80 leading-relaxed">Permanently delete your account and all associated data.</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-2 border border-error/30 text-error font-bold rounded-lg hover:bg-error/20 transition-all active:scale-95 text-[14px]"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-5 bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] p-8 flex flex-col">
            <h3 className="font-display text-2xl text-on-surface mb-6">Notification Hub</h3>
            <div className="space-y-1 flex-1">
              {([
                { key: "emailNotifs" as const, icon: "mail", label: "Email", sub: "Daily Updates" },
                { key: "pushNotifs" as const, icon: "notifications_active", label: "Push", sub: "Mobile & Web" },
                { key: "weeklyDigest" as const, icon: "summarize", label: "Weekly Digest", sub: "Deep Insights" },
              ]).map(({ key, icon, label, sub }, i, arr) => (
                <div
                  key={key}
                  className={`flex items-center justify-between py-5 group cursor-pointer ${i < arr.length - 1 ? "border-b border-outline-variant/20" : ""}`}
                  onClick={() => handlePrefToggle(key)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors ${prefs[key] ? "bg-primary/10 text-primary" : "bg-surface-container-low text-outline"}`}>
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[14px] text-on-surface">{label}</p>
                      <p className="text-[12px] text-outline uppercase font-semibold">{sub}</p>
                    </div>
                  </div>
                  <div className={`w-14 h-8 rounded-full transition-all relative ${prefs[key] ? "bg-primary" : "bg-outline-variant"}`}>
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-sm ${prefs[key] ? "right-1" : "left-1"}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-surface-container-low rounded-[16px] border border-outline-variant/30 relative overflow-hidden group">
              <span className="relative z-10 text-[12px] font-semibold text-primary uppercase tracking-wider mb-2 block">Quick Tip</span>
              <p className="relative z-10 text-[14px] font-semibold text-outline leading-relaxed">Users who enable the Weekly Digest save an average of 12% more per month.</p>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-[16px] p-10 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-error">delete_forever</span>
            </div>
            <h3 className="font-display text-3xl text-center mb-4 text-on-surface">Delete Account?</h3>
            <p className="text-center text-outline mb-8 leading-relaxed font-body-md">
              This action is <strong className="text-on-surface font-semibold">irreversible</strong>. You will lose all your progress, XP, and financial history.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-4 border border-outline-variant/30 rounded-lg font-bold text-outline hover:bg-surface-container transition-all active:scale-95 text-[16px]"
              >
                Keep Account
              </button>
              <button
                onClick={() => { showToastMsg("Request submitted. Our team will contact you."); setShowDeleteModal(false); }}
                className="flex-1 py-4 bg-error text-white rounded-lg font-bold hover:shadow-lg transition-all active:scale-95 text-[16px]"
              >
                Delete Anyway
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
