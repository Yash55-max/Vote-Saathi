'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageSquare, MapPin, Users, BookOpen,
  Bell, Settings, ChevronRight, Home,
  FileText, HelpCircle, Send, Search, User, Globe
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/store/userStore';

const sidebarLinks = (t: any) => [
  { icon: Home, label: t('home'), href: '/' },
  { icon: User, label: 'Onboarding', href: '/onboarding' },
  { icon: FileText, label: t('dashboard'), href: '/dashboard', active: true },
  { icon: BookOpen, label: t('guide'), href: '/voting-guide' },
  { icon: MapPin, label: t('constituency'), href: '/constituency' },
  { icon: Users, label: t('candidates'), href: '/candidates' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const actionCards = (t: any) => [
  { icon: BookOpen, label: t('guide'), color: 'bg-blue-50 text-blue-600' },
  { icon: MapPin, label: t('constituency'), color: 'bg-orange-50 text-orange-600' },
  { icon: Users, label: t('candidates'), color: 'bg-red-50 text-red-600' },
  { icon: Bell, label: 'Reminders', color: 'bg-slate-50 text-slate-600' },
];

export default function DashboardPage() {
  const { t, language } = useTranslation();
  const profile = useUserStore(state => state.profile);
  const sidebar = sidebarLinks(t);
  const cards = actionCards(t);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaskaram! I am Saathi. I can help you find your polling booth, learn about candidates, or understand the voting process. How can I assist you today?' }
  ]);

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* ... Sidebar remains same ... */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                link.active 
                  ? 'bg-primary/5 text-primary' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-50">
           <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary p-2">
             <HelpCircle size={14} /> Contact Helpdesk
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
           <div className="flex items-center gap-4 text-slate-300">
              <Link href="/" className="hover:text-primary transition-colors font-medium text-sm">{t('home')}</Link>
              <ChevronRight size={14} />
              <span className="text-primary font-bold text-sm">{t('dashboard')}</span>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Search size={20} /></button>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Globe size={20} /></button>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200">
                {profile?.name?.substring(0, 2).toUpperCase() || 'AS'}
              </div>
           </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full flex gap-8">
           {/* Left Section: Chat */}
           <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-primary mb-1">{t('dashboard')}</h1>
                <p className="text-slate-400 text-sm font-medium">Your central hub for civic engagement and election information.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-[600px]">
                 {/* Chat Header */}
                 <div className="bg-primary p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                       <MessageSquare size={20} />
                    </div>
                    <div>
                       <h3 className="text-white font-bold text-sm">{t('askSaathi')}</h3>
                       <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{t('saathiSub')}</p>
                    </div>
                 </div>

                 {/* Chat Messages */}
                 <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
                    {messages.map((m, idx) => (
                      <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                         {m.role === 'assistant' && (
                           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                             S
                           </div>
                         )}
                         <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] text-sm leading-relaxed ${
                           m.role === 'assistant' 
                             ? 'bg-white rounded-tl-none border border-slate-100 text-slate-600' 
                             : 'bg-primary rounded-tr-none text-white font-medium'
                         }`}>
                           {m.content}
                         </div>
                         {m.role === 'user' && (
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-bold flex-shrink-0 border border-slate-300">
                             {profile?.name?.substring(0, 2).toUpperCase() || 'U'}
                           </div>
                         )}
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          S
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-slate-400 text-xs italic">
                          Saathi is thinking...
                        </div>
                      </div>
                    )}
                 </div>

                 {/* Chat Input */}
                 <div className="p-4 bg-white border-t border-slate-50 flex items-center gap-3">
                    <input 
                      type="text" 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder={t('chatPlaceholder')}
                      className="flex-1 bg-slate-50 px-4 py-3 rounded-xl text-sm border border-slate-100 focus:outline-none focus:border-primary/30 transition-colors"
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
              
              <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold uppercase tracking-widest px-2">
                 <span>{t('footerText')}</span>
              </div>
           </div>

           {/* Right Section: Action Cards */}
           <div className="w-64 space-y-4">
              <div className="h-[76px]" /> {/* Spacer to align with content */}
              {cards.map(card => (
                <button 
                  key={card.color}
                  className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group"
                >
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color} transition-transform group-hover:scale-110`}>
                      <card.icon size={24} />
                   </div>
                   <div className="font-bold text-slate-600 group-hover:text-primary transition-colors text-sm">
                     {card.label}
                   </div>
                </button>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}

