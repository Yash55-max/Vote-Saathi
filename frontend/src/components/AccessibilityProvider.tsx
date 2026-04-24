'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/store/accessibilityStore';

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { theme, fontSize, dyslexicMode } = useAccessibilityStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove old theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-contrast');
    root.classList.add(`theme-${theme}`);

    // Font size
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);

    // Dyslexic mode
    if (dyslexicMode) {
      root.classList.add('dyslexia-mode');
    } else {
      root.classList.remove('dyslexia-mode');
    }
  }, [theme, fontSize, dyslexicMode]);

  return <>{children}</>;
}
