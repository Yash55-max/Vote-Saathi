'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { translations } from '@/lib/translations';
import { Language } from '@/types';

export function useTranslation() {
  const [mounted, setMounted] = useState(false);
  const languageFromStore = useUserStore((state) => state.language);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const language: Language = mounted ? languageFromStore : 'en';

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  return { t, language, isHydrated: mounted };
}

