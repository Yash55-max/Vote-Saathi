'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, User, Globe, Shield, LogOut,
  ChevronRight, Bell, Eye, Trash2, Save,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/hooks/useTranslation';
import { db, auth } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import type { Language } from '@/types';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi',   native: 'हिंदी' },
  { code: 'te', label: 'Telugu',  native: 'తెలుగు' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { profile, language, updateLanguage, setProfile, clearProfile } = useUserStore();
  
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [voterType, setVoterType] = useState(profile?.voterType || 'First Time');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setAge(profile.age?.toString() || '');
      setVoterType(profile.voterType || 'First Time');
    }
  }, [profile]);

  const saveProfile = async () => {
    if (!profile?.id) return;
    setSaving(true);
    try {
      const updatedData = {
        age: parseInt(age),
        voterType: voterType
      };
      await updateDoc(doc(db, 'users', profile.id), updatedData);
      setProfile({ ...profile, ...updatedData });
      toast.success(t('update') || 'Settings saved!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearProfile();
      router.push('/login');
    } catch (err) {
      toast.error('Sign out failed');
    }
  };

  const sections = [
    {
      title: t('citizenProfile') || 'Profile',
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted mb-1.5 block">{t('age') || 'Your Age'}</label>
            <input
              type="number"
              min={18}
              value={age}
              onChange={e => setAge(e.target.value)}
              className="w-full bg-surface-2 border border-surface-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors text-text"
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-1.5 block">{t('voterType') || 'Voter Status'}</label>
            <div className="grid grid-cols-2 gap-2">
              {['First Time', 'Experienced'].map(s => (
                <button 
                  key={s}
                  onClick={() => setVoterType(s as any)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    voterType === s 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-surface-2 border-surface-2 text-muted'
                  }`}
                >
                  {s === 'First Time' ? t('firstTimeVoterLabel') : t('experiencedVoterLabel')}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all disabled:opacity-60"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save size={16} />}
            {saving ? 'Saving…' : t('update')}
          </button>
        </div>
      ),
    },
    {
      title: t('onboardingLang') || 'Language',
      icon: Globe,
      content: (
        <div className="space-y-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => updateLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                language === lang.code
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-surface-2 bg-surface-2 text-muted hover:border-primary/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">{lang.label}</span>
                <span className="text-[10px] opacity-50">{lang.native}</span>
              </div>
              {language === lang.code && <Check size={16} />}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: t('accessibilityHeading') || 'Accessibility',
      icon: Eye,
      content: (
        <div className="p-4 bg-surface-2 rounded-xl border border-surface-2">
          <p className="text-xs text-muted leading-relaxed">
            Accessibility settings like High Contrast and Text Size are available in the top toolbar for quick access throughout the platform.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="bg-surface border-b border-surface-2 px-6 h-16 flex items-center gap-4 sticky top-0 z-30">
        <Link href="/dashboard" className="p-2 rounded-xl hover:bg-surface-2 transition-colors text-muted hover:text-primary">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading font-extrabold text-lg text-primary">{t('settings')}</h1>
      </header>

      <div className="max-w-lg mx-auto px-6 py-12 space-y-6 pb-24">
        {sections.map((sec, i) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-3xl border border-surface-2 overflow-hidden shadow-sm"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-2 bg-surface-2/30">
              <sec.icon size={18} className="text-primary" />
              <h2 className="font-bold text-primary">{sec.title}</h2>
            </div>
            <div className="p-6">{sec.content}</div>
          </motion.div>
        ))}

        {/* Logout */}
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-4 bg-surface border border-red-100 text-red-600 rounded-3xl font-bold hover:bg-red-50 transition-all"
        >
          <LogOut size={18} /> Sign Out
        </button>

        <p className="text-center text-[10px] font-black text-muted uppercase tracking-widest pt-4">
          VoteSaathi v1.0.0 · Digital Public Utility
        </p>
      </div>
    </div>
  );
}
