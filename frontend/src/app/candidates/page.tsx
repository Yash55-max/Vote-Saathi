'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/store/userStore';

interface Candidate {
  id: number;
  name: string;
  party: string;
  partyShort: string;
  constituency: string;
  age: number;
  education: string;
  assets: string;
  criminalCases: number;
  color: string;
  emoji: string;
}

export default function CandidatesPage() {
  const { t } = useTranslation();
  const profile = useUserStore(state => state.profile);
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<Candidate[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const url = profile?.location?.constituency 
          ? `http://localhost:8000/api/candidates?constituency=${encodeURIComponent(profile.location.constituency)}`
          : 'http://localhost:8000/api/candidates';
        const res = await fetch(url);
        const data = await res.json();
        
        // Map backend schema to frontend Candidate type
        const mapped = data.map((c: any) => ({
          ...c,
          partyShort: c.party_short,
          criminalCases: c.criminal_cases,
          // Add UI decorations that aren't in the DB
          color: c.party_short === 'BJP' ? '#FF6B35' : c.party_short === 'INC' ? '#1570EF' : '#E91E8C',
          emoji: c.party_short === 'BJP' ? '🏛️' : c.party_short === 'INC' ? '✋' : '🌹'
        }));
        setCandidates(mapped);
      } catch (err) {
        console.error('Failed to fetch candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [profile?.location?.constituency]);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.party.toLowerCase().includes(search.toLowerCase()) ||
    c.constituency.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCompare = (c: Candidate) => {
    if (compareList.find((x: Candidate) => x.id === c.id)) {
      setCompareList((prev: Candidate[]) => prev.filter((x: Candidate) => x.id !== c.id));
    } else if (compareList.length < 2) {
      setCompareList((prev: Candidate[]) => [...prev, c]);
    }
  };

  const isSelected = (c: Candidate) => !!compareList.find((x: Candidate) => x.id === c.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted hover:text-white">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading font-semibold">Candidates</h1>
        {compareList.length === 2 && (
          <button
            onClick={() => setShowCompare(true)}
            className="ml-auto px-3 py-1.5 bg-primary rounded-lg text-xs font-medium animate-pulse-slow"
          >
            Compare ({compareList.length})
          </button>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-24">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search by name, party, constituency…"
            className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {compareList.length > 0 && compareList.length < 2 && (
          <p className="text-xs text-muted">Select one more candidate to compare</p>
        )}

        {/* Candidate cards */}
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-2xl p-5 border transition-all ${
                isSelected(c) ? 'border-primary/60 bg-primary/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${c.color}20` }}>
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{c.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                      {c.partyShort}
                    </span>
                    <span className="text-xs text-muted">{c.constituency}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center">
                      <p className="text-xs text-muted">Age</p>
                      <p className="text-sm font-medium">{c.age}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted">Assets</p>
                      <p className="text-sm font-medium">{c.assets}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted">Cases</p>
                      <p className={`text-sm font-medium ${c.criminalCases > 0 ? 'text-error' : 'text-success'}`}>
                        {c.criminalCases === 0 ? '✓ None' : c.criminalCases}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleCompare(c)}
                  disabled={!isSelected(c) && compareList.length >= 2}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                    isSelected(c)
                      ? 'bg-primary border-primary text-white'
                      : 'border-white/20 text-muted hover:border-primary/50 disabled:opacity-30'
                  }`}
                >
                  {isSelected(c) ? <CheckCircle2 size={16} /> : <Filter size={14} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && compareList.length === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCompare(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="glass rounded-2xl p-6 border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl">Head-to-Head Comparison</h2>
                <button onClick={() => setShowCompare(false)} className="text-muted hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {compareList.map((c: Candidate) => (
                  <div key={c.id} className="space-y-3">
                    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${c.color}15` }}>
                      <div className="text-3xl mb-1">{c.emoji}</div>
                      <h3 className="font-bold text-sm">{c.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.partyShort}</span>
                    </div>
                    {[
                      { label: 'Party',       value: c.party },
                      { label: 'Constituency', value: c.constituency },
                      { label: 'Age',          value: String(c.age) },
                      { label: 'Education',    value: c.education },
                      { label: 'Assets',       value: c.assets },
                      { label: 'Criminal Cases', value: c.criminalCases === 0 ? '✅ None' : `⚠️ ${c.criminalCases}` },
                    ].map(row => (
                      <div key={row.label} className="bg-surface-2 rounded-xl p-3">
                        <p className="text-xs text-muted mb-0.5">{row.label}</p>
                        <p className="text-sm font-medium">{row.value}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
