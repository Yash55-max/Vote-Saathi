'use client';

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, saveUserProfile } from '@/lib/firestore';
import { useUserStore } from '@/store/userStore';

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setProfile, clearProfile } = useUserStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) setProfile(profile);
      } else {
        clearProfile();
      }
      setLoading(false);
    });
    return unsub;
  }, [setProfile, clearProfile]);

  const loginWithEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const registerWithEmail = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserProfile(cred.user.uid, {
      id: cred.user.uid,
      name,
      email,
      age: 0,
      language: 'en',
      voter_status: 'first_time',
      onboardingComplete: false,
    });
    return cred;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const existingProfile = await getUserProfile(cred.user.uid);
    if (!existingProfile) {
      await saveUserProfile(cred.user.uid, {
        id: cred.user.uid,
        name: cred.user.displayName ?? undefined,
        email: cred.user.email ?? undefined,
        age: 0,
        language: 'en',
        voter_status: 'first_time',
        onboardingComplete: false,
      });
    }
    return cred;
  };

  const logout = () => signOut(auth);

  return { user, loading, loginWithEmail, registerWithEmail, loginWithGoogle, logout };
}
