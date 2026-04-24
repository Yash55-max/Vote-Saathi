import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, Interaction } from '@/types';

// ─── User Profile ────────────────────────────────────────────

export async function saveUserProfile(uid: string, profile: Partial<UserProfile>) {
  await setDoc(doc(db, 'users', uid), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

// ─── Interactions (chat history) ────────────────────────────

export async function saveInteraction(interaction: Omit<Interaction, 'id' | 'timestamp'>) {
  return addDoc(collection(db, 'interactions'), {
    ...interaction,
    timestamp: serverTimestamp(),
  });
}

export async function getUserInteractions(uid: string, limitCount = 20): Promise<Interaction[]> {
  const q = query(
    collection(db, 'interactions'),
    where('uid', '==', uid),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Interaction));
}

// ─── Reminders ──────────────────────────────────────────────

export async function saveReminder(uid: string, reminder: {
  label: string;
  date: string;
  time: string;
}) {
  return addDoc(collection(db, 'reminders'), {
    uid,
    ...reminder,
    active: true,
    createdAt: serverTimestamp(),
  });
}

export async function getUserReminders(uid: string) {
  const q = query(
    collection(db, 'reminders'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
