'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ t }) => {
  return (
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block text-accent font-bold tracking-widest text-xs uppercase mb-4">
          {t('digitalUtility')}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary leading-tight mb-6">
          {t('heroTitle').split('.').map((part: string, i: number) => (
            <span key={i}>{part}{i === 0 && '.'}<br /></span>
          ))}
        </h1>
        <p className="text-muted text-lg max-w-lg mb-8 leading-relaxed">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/onboarding"
            className="px-8 py-3 bg-primary text-white rounded-md font-bold hover:bg-primary-700 transition-all flex items-center gap-2 group">
            {t('startGuidance')} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video lg:aspect-square border-4 border-surface shadow-primary/10"
      >
        <img 
          src="/hero_democracy.png" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=1000";
          }}
          alt="Empowering Indian Democracy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
};

export default Hero;
