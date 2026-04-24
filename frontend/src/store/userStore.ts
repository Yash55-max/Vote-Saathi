import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Language } from '@/types';

interface UserState {
  profile: UserProfile | null;
  language: Language;
  isAuthenticated: boolean;
  setProfile: (profile: UserProfile) => void;
  updateLanguage: (language: Language) => void;
  updateLocation: (location: UserProfile['location']) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      language: 'en',
      isAuthenticated: false,

      setProfile: (profile) =>
        set({ profile, language: profile.language, isAuthenticated: true }),

      updateLanguage: (language) =>
        set(state => ({
          language,
          profile: state.profile ? { ...state.profile, language } : null,
        })),

      updateLocation: (location) =>
        set(state => ({
          profile: state.profile ? { ...state.profile, location } : null,
        })),

      clearProfile: () =>
        set({ profile: null, language: 'en', isAuthenticated: false }),
    }),
    {
      name: 'votesaathi-user',
      partialize: (state) => ({ 
        profile: state.profile, 
        language: state.language,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
