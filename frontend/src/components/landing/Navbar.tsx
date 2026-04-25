'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Contrast, HelpCircle, User } from 'lucide-react';

interface NavbarProps {
  t: (key: string) => string;
}

const Navbar: React.FC<NavbarProps> = ({ t }) => {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-surface border-b border-surface-2">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading font-extrabold text-2xl text-primary flex items-center gap-2">
            <span className="p-1.5 bg-primary rounded-lg text-white">🗳️</span>
            Vote Saathi
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">{t('home')}</Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-primary transition-colors">{t('dashboard')}</Link>
            <Link href="/voting-guide" className="text-sm font-medium text-muted hover:text-primary transition-colors">{t('guide')}</Link>
            <Link href="/candidates" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{t('candidates')}</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-muted hover:text-primary" aria-label="Language Selector"><Globe size={20} /></button>
          <button className="p-2 text-muted hover:text-primary" aria-label="Toggle Contrast"><Contrast size={20} /></button>
          <button className="p-2 text-muted hover:text-primary" aria-label="Help"><HelpCircle size={20} /></button>
          <div className="h-6 w-[1px] bg-surface-2 mx-2" />
          <Link href="/login" className="p-2 text-muted hover:text-primary transition-colors" aria-label="User Profile">
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
