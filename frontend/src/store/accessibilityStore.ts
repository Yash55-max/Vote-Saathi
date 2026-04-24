import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'contrast';
type FontSize = 'small' | 'medium' | 'large';

interface AccessibilityState {
  theme: Theme;
  fontSize: FontSize;
  dyslexicMode: boolean;
  
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  toggleDyslexicMode: () => void;
  reset: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      theme: 'light',
      fontSize: 'medium',
      dyslexicMode: false,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleDyslexicMode: () => set((state) => ({ dyslexicMode: !state.dyslexicMode })),
      reset: () => set({ theme: 'light', fontSize: 'medium', dyslexicMode: false }),
    }),
    {
      name: 'votesaathi-accessibility',
    }
  )
);
