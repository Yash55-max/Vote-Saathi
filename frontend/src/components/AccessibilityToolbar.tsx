'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Accessibility, 
  Contrast, 
  Plus, 
  Minus, 
  RefreshCw,
  Search,
  Type
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function AccessibilityToolbar() {
  const [fontSize, setFontSize] = useState(2); // 1 to 4
  const [highContrast, setHighContrast] = useState(false);
  const updateLanguage = useUserStore((state) => state.updateLanguage);
  const currentLang = useUserStore((state) => state.language);

  useEffect(() => {
    // Apply Font Size
    const html = document.documentElement;
    html.classList.remove('text-scale-1', 'text-scale-2', 'text-scale-3', 'text-scale-4');
    html.classList.add(`text-scale-${fontSize}`);

    // Apply High Contrast
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast]);

  const reset = () => {
    setFontSize(2);
    setHighContrast(false);
  };

  return (
    <div className="bg-[#001A4D] text-white border-b border-white/10 hidden md:block" role="complementary" aria-label="Accessibility Toolbar">
      <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <div className="flex items-center gap-2 border-r border-white/20 pr-4">
             <Accessibility size={14} className="text-orange-500" />
             Screen Reader Access
          </div>
          <div className="flex items-center gap-4">
             <span>Text Size:</span>
             <div className="flex items-center gap-1">
                <button 
                  onClick={() => fontSize > 1 && setFontSize(fontSize - 1)}
                  className="w-6 h-6 bg-white/10 hover:bg-white/20 flex items-center justify-center rounded"
                  aria-label="Decrease text size"
                >
                  <Minus size={10} />
                </button>
                <button 
                  onClick={() => setFontSize(2)}
                  className={`w-6 h-6 flex items-center justify-center rounded ${fontSize === 2 ? 'bg-orange-500' : 'bg-white/10'}`}
                  aria-label="Normal text size"
                >
                  A
                </button>
                <button 
                  onClick={() => fontSize < 4 && setFontSize(fontSize + 1)}
                  className="w-6 h-6 bg-white/10 hover:bg-white/20 flex items-center justify-center rounded"
                  aria-label="Increase text size"
                >
                  <Plus size={10} />
                </button>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${highContrast ? 'bg-yellow-400 text-black' : 'hover:bg-white/10'}`}
            aria-pressed={highContrast}
          >
            <Contrast size={14} />
            High Contrast
          </button>
          
          <button onClick={reset} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <RefreshCw size={12} /> Reset
          </button>

          <div className="flex items-center gap-3 border-l border-white/20 pl-6">
            <button 
              onClick={() => updateLanguage('en')}
              className={currentLang === 'en' ? 'text-orange-500' : 'hover:text-orange-500'}
            >
              English
            </button>
            <button 
              onClick={() => updateLanguage('hi')}
              className={currentLang === 'hi' ? 'text-orange-500' : 'text-white/40 hover:text-white'}
            >
              हिंदी
            </button>
            <button 
              onClick={() => updateLanguage('te')}
              className={currentLang === 'te' ? 'text-orange-500' : 'text-white/40 hover:text-white'}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
