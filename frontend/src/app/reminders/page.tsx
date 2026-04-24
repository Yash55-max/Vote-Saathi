'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Plus, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Reminder {
  id: string;
  label: string;
  date: string;
  time: string;
  active: boolean;
}

const PRESET_REMINDERS = [
  { label: '🗳️ Voting Day Reminder',         date: '', time: '08:00' },
  { label: '📋 Document Check (Day before)', date: '', time: '20:00' },
  { label: '🔍 Check Voter Roll',             date: '', time: '10:00' },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');

  const addReminder = () => {
    if (!label || !date) {
      toast.error('Please fill in reminder label and date.');
      return;
    }
    const newR: Reminder = { id: Date.now().toString(), label, date, time, active: true };
    setReminders(prev => [newR, ...prev]);
    setLabel(''); setDate('');
    toast.success('Reminder set! We\'ll notify you.');
  };

  const deleteReminder = (id: string) =>
    setReminders(prev => prev.filter(r => r.id !== id));

  const addPreset = (preset: typeof PRESET_REMINDERS[0]) => {
    const today = new Date();
    const d = new Date(today.setDate(today.getDate() + 7));
    const dateStr = d.toISOString().split('T')[0];
    const newR: Reminder = { id: Date.now().toString(), label: preset.label, date: dateStr, time: preset.time, active: true };
    setReminders(prev => [newR, ...prev]);
    toast.success('Reminder added!');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted hover:text-white">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading font-semibold">Reminders</h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-8 pb-24">
        {/* Add new reminder */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
            <Plus size={18} className="text-primary" /> Set New Reminder
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted mb-1.5 block">Label</label>
              <input
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g. Voting day reminder"
                className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <button
              onClick={addReminder}
              className="w-full py-3 bg-primary rounded-xl font-semibold hover:bg-primary-500 transition-all glow-primary"
            >
              Set Reminder
            </button>
          </div>
        </div>

        {/* Quick presets */}
        <div>
          <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
            <Bell size={18} className="text-primary" /> Quick Presets
          </h2>
          <div className="space-y-3">
            {PRESET_REMINDERS.map(p => (
              <button
                key={p.label}
                onClick={() => addPreset(p)}
                className="w-full flex items-center gap-4 glass rounded-xl p-4 border border-white/10 hover:border-primary/30 transition-all text-left group"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.label}</p>
                  <p className="text-xs text-muted mt-0.5">Default time: {p.time}</p>
                </div>
                <Plus size={16} className="text-muted group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Existing reminders */}
        {reminders.length > 0 && (
          <div>
            <h2 className="font-heading font-semibold text-lg mb-4">Your Reminders</h2>
            <div className="space-y-3">
              {reminders.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-4 border border-success/20 bg-success/5 flex items-center gap-4"
                >
                  <Bell size={18} className="text-success flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{r.label}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                      <Clock size={10} />
                      {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {r.time}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="text-muted hover:text-error transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {reminders.length === 0 && (
          <div className="text-center py-8 text-muted">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No reminders set yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
