import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  phone?: string;
  createdAt?: unknown;
  xp: number;
  level: number;
  streak: number;
  currency?: string;
  language?: string;
  emailNotifs?: boolean;
  pushNotifs?: boolean;
  weeklyDigest?: boolean;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, "users", uid), { ...data });
}

// ─── XP & Levelling ──────────────────────────────────────────────────────────

const XP_PER_LEVEL = 100;

export async function awardXP(uid: string, amount: number): Promise<{ newXP: number; newLevel: number }> {
  const profile = await getUserProfile(uid);
  if (!profile) throw new Error("User profile not found");

  const newXP = (profile.xp ?? 0) + amount;
  const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

  await updateDoc(doc(db, "users", uid), { xp: newXP, level: newLevel });
  return { newXP, newLevel };
}

// ─── Budget Entries ───────────────────────────────────────────────────────────

export interface BudgetEntry {
  id?: string;
  uid: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  note?: string;
  createdAt?: unknown;
}

export async function saveBudgetEntry(uid: string, entry: Omit<BudgetEntry, "id" | "uid" | "createdAt">): Promise<string> {
  const ref = doc(db, `users/${uid}/budget`, Date.now().toString());
  await setDoc(ref, { ...entry, uid, createdAt: serverTimestamp() });
  return ref.id;
}

// ─── Quiz Progress ────────────────────────────────────────────────────────────

export interface QuizProgress {
  quizId: string;
  completed: boolean;
  score?: number;
  completedAt?: unknown;
}

export async function saveQuizProgress(uid: string, progress: QuizProgress): Promise<void> {
  const ref = doc(db, `users/${uid}/quizProgress`, progress.quizId);
  await setDoc(ref, { ...progress, completedAt: serverTimestamp() }, { merge: true });
}

export async function getQuizProgress(uid: string, quizId: string): Promise<QuizProgress | null> {
  const snap = await getDoc(doc(db, `users/${uid}/quizProgress`, quizId));
  return snap.exists() ? (snap.data() as QuizProgress) : null;
}
