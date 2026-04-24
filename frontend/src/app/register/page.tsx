'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Firebase createUserWithEmailAndPassword
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <span className="text-4xl">🗳️</span>
            <h1 className="font-heading text-2xl font-bold mt-2 mb-1">Create your account</h1>
            <p className="text-muted text-sm">Join thousands of informed voters</p>
          </div>

          {/* Google SSO */}
          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 glass rounded-xl border border-white/10 hover:border-primary/40 transition-all hover:bg-surface-2 font-medium mb-6">
            <Chrome size={18} className="text-primary" />
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-muted text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="name">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="name" name="name" type="text" value={form.name}
                  onChange={handleChange} placeholder="Rahul Sharma" required
                  className="w-full bg-surface-2 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="reg-email">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="reg-email" name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com" required
                  className="w-full bg-surface-2 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="reg-password" name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters" required minLength={8}
                  className="w-full bg-surface-2 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary rounded-xl font-semibold hover:bg-primary-500 transition-all glow-primary disabled:opacity-60">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><ArrowRight size={16} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>

        <Link href="/" className="block text-center text-sm text-muted mt-4 hover:text-white transition-colors">
          ← Back to home
        </Link>
      </motion.div>
    </main>
  );
}
