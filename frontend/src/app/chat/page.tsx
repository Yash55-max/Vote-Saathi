'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, ArrowLeft, Bot, User, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  'How do I register to vote?',
  'What documents do I need at the booth?',
  'Where is my nearest polling booth?',
  'What is the election schedule?',
  'How to check my voter registration status?',
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Namaste! 🙏 I'm your VoteSaathi AI assistant. I can help you with voter registration, polling booth locations, election schedules, and any other election-related questions. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: { language: 'en', age: null, location: null, firstTimeVoter: null },
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not get a response. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ Could not reach the server. Make sure the backend is running.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted hover:text-white">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
          <Bot size={18} className="text-primary" />
        </div>
        <div>
          <h1 className="font-heading font-semibold text-sm">VoteSaathi AI</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted">Online · Powered by Gemini</span>
          </div>
        </div>
        <Sparkles size={16} className="ml-auto text-primary" />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] sm:max-w-[65%] space-y-1`}>
                <div className={`chat-bubble px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'glass border border-white/10 text-white rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <p className={`text-[10px] text-muted ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={14} className="text-muted" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-primary" />
              </div>
              <div className="glass border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="typing-dot w-2 h-2 rounded-full bg-muted" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted mb-2">Suggested questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 px-3 py-2 glass rounded-lg text-xs text-muted hover:text-white hover:border-primary/40 transition-all border border-white/10 whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="glass border-t border-white/5 px-4 py-3">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about voting, registration, candidates…"
            className="flex-1 bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary-500 transition-all glow-primary disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
