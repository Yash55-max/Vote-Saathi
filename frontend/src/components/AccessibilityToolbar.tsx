'use client';

import { 
  Globe, 
  Accessibility, 
  Contrast, 
  Plus, 
  Minus, 
  RefreshCw,
  Moon,
  Sun,
  Type
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useAccessibilityStore } from '@/store/accessibilityStore';

export default function AccessibilityToolbar() {
  const { 
    theme, setTheme, 
    fontSize, setFontSize, 
    dyslexicMode, toggleDyslexicMode,
    reset: resetAccess 
  } = useAccessibilityStore();
  
  const updateLanguage = useUserStore((state) => state.updateLanguage);
  const currentLang = useUserStore((state) => state.language);

  return (
    <div className="bg-[#001A4D] text-white border-b border-white/10 hidden md:block" role="complementary" aria-label="Accessibility Toolbar">
      <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <div className="flex items-center gap-2 border-r border-white/20 pr-4">
             <Accessibility size={14} className="text-orange-500" />
             Screen Reader
          </div>
          
          <div className="flex items-center gap-4">
             <span>Text:</span>
             <div className="flex items-center gap-1">
                <button 
                  onClick={() => setFontSize('small')}
                  className={`w-6 h-6 flex items-center justify-center rounded ${fontSize === 'small' ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <Minus size={10} />
                </button>
                <button 
                  onClick={() => setFontSize('medium')}
                  className={`w-6 h-6 flex items-center justify-center rounded ${fontSize === 'medium' ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  A
                </button>
                <button 
                  onClick={() => setFontSize('large')}
                  className={`w-6 h-6 flex items-center justify-center rounded ${fontSize === 'large' ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <Plus size={10} />
                </button>
             </div>
             
             <button 
               onClick={toggleDyslexicMode}
               className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${dyslexicMode ? 'bg-blue-500' : 'hover:bg-white/10'}`}
             >
               <Type size={12} /> Dyslexia
             </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-0.5">
            <button 
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-white text-primary shadow-sm' : 'text-white/40 hover:text-white'}`}
              title="Light Mode"
            >
              <Sun size={14} />
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-white text-primary shadow-sm' : 'text-white/40 hover:text-white'}`}
              title="Dark Mode"
            >
              <Moon size={14} />
            </button>
            <button 
              onClick={() => setTheme('contrast')}
              className={`p-1.5 rounded-md transition-all ${theme === 'contrast' ? 'bg-yellow-400 text-black shadow-sm' : 'text-white/40 hover:text-white'}`}
              title="High Contrast"
            >
              <Contrast size={14} />
            </button>
          </div>
          
          <button onClick={resetAccess} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <RefreshCw size={12} /> {currentLang === 'en' ? 'Reset' : 'पुनर्स्थापित'}
          </button>

          <div className="flex items-center gap-3 border-l border-white/20 pl-6">
            <button 
              onClick={() => updateLanguage('en')}
              className={currentLang === 'en' ? 'text-orange-500' : 'hover:text-orange-500'}
            >
              EN
            </button>
            <button 
              onClick={() => updateLanguage('hi')}
              className={currentLang === 'hi' ? 'text-orange-500' : 'text-white/40 hover:text-white'}
            >
              HI
            </button>
            <button 
              onClick={() => updateLanguage('te')}
              className={currentLang === 'te' ? 'text-orange-500' : 'text-white/40 hover:text-white'}
            >
              TE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
