'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, User, Globe, Shield, LogOut,
  ChevronRight, Bell, Eye, Trash2, Save
} from 'lucide-react';
import toast from 'react-hot-toast';

type Language = 'en' | 'hi' | 'te';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi',   native: 'हिंदी' },
  { code: 'te', label: 'Telugu',  native: 'తెలుగు' },
];

export default function SettingsPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [age, setAge]           = useState('22');
  const [notifications, setNotifications] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [saving, setSaving]     = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // TODO: Firestore update
    setSaving(false);
    toast.success('Profile saved!');
  };

  const handleDeleteData = () => {
    toast('Data deletion requested. This will be processed within 48 hours.', { icon: '🗑️' });
  };

  const sections = [
    {
      title: 'Profile',
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted mb-1.5 block">Your Age</label>
            <input
              type="number"
              min={18}
              value={age}
              onChange={e => setAge(e.target.value)}
              className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-1.5 block">Voter Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['First-time Voter', 'Returning Voter'].map(s => (
                <button key={s}
                  className="py-2 px-3 glass rounded-xl border border-white/10 text-sm hover:border-primary/40 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary rounded-xl font-semibold hover:bg-primary-500 transition-all glow-primary disabled:opacity-60"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save size={16} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      ),
    },
    {
      title: 'Language',
      icon: Globe,
      content: (
        <div className="space-y-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                language === lang.code
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-white/10 bg-surface-2 text-muted hover:border-white/20'
              }`}
            >
              <span className="font-medium">{lang.label}</span>
              <span>{lang.native}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted">Election reminders and updates</p>
            </div>
            <button
              onClick={() => setNotifications(v => !v)}
              className={`w-11 h-6 rounded-full transition-all relative ${notifications ? 'bg-primary' : 'bg-surface-2 border border-white/20'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${notifications ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Privacy & Data',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <p className="text-sm font-medium">Usage Analytics</p>
              <p className="text-xs text-muted">Help improve VoteSaathi</p>
            </div>
            <button
              onClick={() => setDataCollection(v => !v)}
              className={`w-11 h-6 rounded-full transition-all relative ${dataCollection ? 'bg-primary' : 'bg-surface-2 border border-white/20'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${dataCollection ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
          <button
            onClick={handleDeleteData}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-error/30 text-error hover:bg-error/10 transition-all text-sm"
          >
            <Trash2 size={16} />
            Request Data Deletion
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted hover:text-white">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading font-semibold">Settings</h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4 pb-24">
        {sections.map((sec, i) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <sec.icon size={18} className="text-primary" />
              <h2 className="font-heading font-semibold">{sec.title}</h2>
            </div>
            <div className="p-5">{sec.content}</div>
          </motion.div>
        ))}

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 py-3 glass rounded-2xl border border-error/20 text-error hover:bg-error/10 transition-all font-medium">
          <LogOut size={18} /> Sign Out
        </button>

        <p className="text-center text-xs text-muted pt-2">
          VoteSaathi v1.0.0 · Made with ❤️ for Indian voters
        </p>
      </div>
    </div>
  );
}
