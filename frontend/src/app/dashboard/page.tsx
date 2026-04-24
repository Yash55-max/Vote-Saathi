'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MessageSquare, MapPin, Users, BookOpen,
  Bell, Settings, ChevronRight, Home,
  FileText, HelpCircle, Send, Search, User, Globe, Bot
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/store/userStore';

const sidebarLinks = (t: any, profile: any) => [
  { icon: Home, label: t('home'), href: '/' },
  ...(!profile?.onboardingComplete ? [{ icon: User, label: t('onboarding'), href: '/onboarding' }] : []),
  { icon: FileText, label: t('dashboard'), href: '/dashboard', active: true },
  { icon: BookOpen, label: t('guide'), href: '/voting-guide' },
  { icon: MapPin, label: t('constituency'), href: '/constituency' },
  { icon: Users, label: t('candidates'), href: '/candidates' },
  { icon: Settings, label: t('settings'), href: '/settings' },
];

const actionCards = (t: any) => [
  { icon: BookOpen, label: t('guide'), color: 'bg-blue-50 text-blue-600', href: '/voting-guide' },
  { icon: MapPin, label: t('constituency'), color: 'bg-orange-50 text-orange-600', href: '/constituency' },
  { icon: Users, label: t('candidates'), color: 'bg-red-50 text-red-600', href: '/candidates' },
  { icon: Bell, label: t('reminders'), color: 'bg-slate-50 text-slate-600', href: '/dashboard' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const profile = useUserStore(state => state.profile);
  const sidebar = sidebarLinks(t, profile);
  const cards = actionCards(t);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('saathiWelcome') }
  ]);

  useEffect(() => {
    if (!profile?.onboardingComplete) {
      router.push('/onboarding');
    }
  }, [profile, router]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            language: language,
            age: profile?.age ? Number(profile.age) : null,
            location: profile?.location?.constituency || null,
            first_time_voter: profile?.voter_status === 'first_time'
          },
          history: messages.slice(-10).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content
          }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-text">
      {/* ... Sidebar remains same ... */}
      <aside className="w-64 bg-surface border-r border-surface-2 flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <span className="font-heading font-extrabold text-lg text-primary flex items-center gap-2">
            <span className="p-1 bg-primary rounded text-white text-xs">🗳️</span>
            Vote Saathi
            <span className="text-[10px] font-bold text-slate-300 ml-auto uppercase tracking-tighter">{t('digitalUtility')}</span>
          </span>
        </div>

        <div className="px-4 mb-6">
          <button className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20">
            {t('checkStatus')}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebar.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${link.active
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-muted hover:bg-surface-2 hover:text-primary'
                }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-surface-2 space-y-2">
           <a 
             href="tel:1950" 
             className="flex items-center gap-2 text-[10px] font-black text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors uppercase tracking-widest"
           >
             <HelpCircle size={14} /> Helpline: 1950
           </a>
           <a 
             href="https://voters.eci.gov.in" 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center gap-2 text-[10px] font-black text-muted hover:text-primary p-2 rounded-lg transition-colors uppercase tracking-widest"
           >
             <Globe size={14} /> Voter Portal
           </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-surface-2 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 text-muted">
            <Link href="/" className="hover:text-primary transition-colors font-medium text-sm">{t('home')}</Link>
            <ChevronRight size={14} />
            <span className="text-primary font-bold text-sm">{t('dashboard')}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted hover:text-primary transition-colors"><Search size={20} /></button>
            <button className="p-2 text-muted hover:text-primary transition-colors"><Globe size={20} /></button>
            <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-primary font-bold text-xs border border-surface-2">
              {profile?.name?.substring(0, 2).toUpperCase() || 'AS'}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="mb-8 p-6 bg-surface border border-surface-2 rounded-2xl shadow-sm">
               <h1 className="text-2xl font-extrabold text-primary mb-2 flex items-center gap-3">
                  {t('goodMorning')}, {profile?.name || 'Citizen'}!
               </h1>
               <p className="text-muted">{t('accessibilitySub')}</p>
            </div>

              <div className="flex-1 flex flex-col bg-surface border border-surface-2 rounded-3xl shadow-sm shadow-slate-200/50 overflow-hidden">
                 <div className="p-4 border-b border-surface-2 flex items-center justify-between bg-surface">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Bot size={20} />
                       </div>
                       <div>
                          <div className="font-bold text-sm text-text">{t('askSaathi')}</div>
                          <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('saathiSub')}</div>
                       </div>
                    </div>
                 </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
                {messages.length === 0 && (
                   <div className="space-y-6 py-4">
                      <div className="bg-surface border border-surface-2 p-6 rounded-3xl shadow-sm">
                         <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                            <Bot size={24} />
                         </div>
                         <h4 className="font-bold text-lg text-primary mb-2">Namaste! I am VoteSaathi.</h4>
                         <p className="text-sm text-muted leading-relaxed">
                            I am your AI-powered election assistant. I can help you navigate the voting process with ease. Here is what I can do for you:
                         </p>
                         <ul className="mt-4 space-y-3">
                            <li className="flex items-center gap-3 text-xs font-bold text-text bg-surface-2 p-3 rounded-xl border border-surface-2">
                               <span className="text-primary">📍</span> Find your polling booth & constituency
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-text bg-surface-2 p-3 rounded-xl border border-surface-2">
                               <span className="text-primary">📜</span> Explain your voting rights & eligibility
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-text bg-surface-2 p-3 rounded-xl border border-surface-2">
                               <span className="text-primary">📝</span> Guide you through voter registration
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-text bg-surface-2 p-3 rounded-xl border border-surface-2">
                               <span className="text-primary">🗳️</span> Provide information on ethical voting
                            </li>
                         </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                         {[
                            "Where is my polling booth?",
                            "What documents do I need to vote?",
                            "How do I register as a first-time voter?",
                            "What is a constituency?"
                         ].map((q) => (
                            <button 
                              key={q}
                              onClick={() => {
                                 setInput(q);
                                 setTimeout(handleSendMessage, 100);
                              }}
                              className="text-left px-4 py-3 bg-white border border-surface-2 rounded-xl text-xs font-semibold text-muted hover:border-primary/30 hover:text-primary transition-all shadow-sm"
                            >
                               {q}
                            </button>
                         ))}
                      </div>
                   </div>
                )}
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                    {m.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        S
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-primary text-white ml-auto rounded-tr-none' 
                          : 'bg-surface-2 text-text rounded-tl-none border border-surface-2'
                      }`}
                    >{m.content}
                    </div>
                      {m.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted text-[10px] font-bold flex-shrink-0 border border-surface-2">
                          {profile?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                    <div className="p-4 bg-surface border-t border-surface-2 flex items-center gap-3">
                       <input 
                         type="text" 
                         value={input}
                         onChange={e => setInput(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                         placeholder={t('chatPlaceholder')}
                         className="flex-1 bg-surface-2 px-4 py-3 rounded-xl text-sm border border-surface-2 focus:outline-none focus:border-primary/30 transition-colors"
                       />
                        <button
                          onClick={handleSendMessage}
                          disabled={loading || !input.trim()}
                          className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all disabled:opacity-50"
                        >
                          <Send size={18} />
                        </button>
                    </div>
            </div>

              <div className="flex items-center justify-between text-[10px] text-muted font-bold uppercase tracking-widest px-2">
                <span>{t('footerText')}</span>
              </div>
          </div>

          <div className="w-full lg:w-72 space-y-6">
                 <div className="bg-surface rounded-2xl border border-surface-2 shadow-sm overflow-hidden">
                    <div className="bg-surface-2 p-4 border-b border-surface-2 flex items-center justify-between">
                       <h3 className="font-bold text-primary text-xs uppercase tracking-widest">{t('citizenProfile')}</h3>
                <Link href="/onboarding" className="text-[10px] font-bold text-accent hover:underline">Update</Link>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {profile?.age}
                  </div>
                    <div>
                      <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{t('yearsOld')}</div>
                      <div className="font-bold text-text">{t('verifiedEligibility')}</div>
                    </div>
                </div>

                       <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 bg-surface-2 rounded-xl">
                             <div className="text-[8px] font-bold text-muted uppercase mb-1">{t('onboardingLang')}</div>
                             <div className="text-xs font-bold text-primary capitalize">{profile?.language === 'hi' ? 'Hindi' : profile?.language === 'te' ? 'Telugu' : 'English'}</div>
                          </div>
                          <div className="p-3 bg-surface-2 rounded-xl">
                             <div className="text-[8px] font-bold text-muted uppercase mb-1">{t('voterType')}</div>
                             <div className="text-xs font-bold text-primary capitalize">
                                {profile?.voter_status === 'first_time' ? t('firstTimeVoterLabel') : t('experiencedVoterLabel')}
                             </div>
                          </div>
                       </div>

                {profile?.constituency && (
                  <div className="p-3 bg-primary/5 rounded-xl flex items-center gap-3 border border-primary/10">
                    <MapPin size={14} className="text-primary" />
                    <div>
                      <div className="text-[8px] font-bold text-primary uppercase">Constituency</div>
                      <div className="text-xs font-bold text-text">{profile.constituency}</div>
                    </div>
                  </div>
                )}

                {profile?.booths?.[0] && (
                  <div className="p-3 bg-surface-2 rounded-xl flex items-start gap-3 border border-surface-2">
                    <div className="w-4 h-4 bg-primary/10 rounded flex items-center justify-center text-primary mt-0.5">
                      <Home size={10} />
                    </div>
                    <div>
                      <div className="text-[8px] font-bold text-muted uppercase">Polling Booth</div>
                      <div className="text-[10px] font-bold text-text leading-tight">{profile.booths[0].name}</div>
                      <div className="text-[8px] text-muted mt-0.5 leading-tight">{profile.booths[0].address}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
               <div className="text-xs font-bold text-muted uppercase tracking-widest px-2">{t('quickActions')}</div>
               {cards.map(card => (
                 <Link 
                   key={card.href + card.label}
                   href={card.href}
                   className="w-full bg-surface p-5 rounded-2xl border border-surface-2 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
                 >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} transition-transform group-hover:scale-110`}>
                       <card.icon size={20} />
                    </div>
                    <div className="font-bold text-text group-hover:text-primary transition-colors text-sm">
                      {card.label}
                    </div>
                    <ChevronRight size={14} className="ml-auto text-muted" />
                 </Link>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

