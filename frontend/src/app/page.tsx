'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe, 
  Accessibility, 
  Contrast, 
  ChevronRight,
  Shield,
  HelpCircle,
  Menu,
  User
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const accessibilityFeatures = (t: any) => [
  { 
    icon: Globe, 
    label: t('multilingual'), 
    desc: t('multilingualDesc')
  },
  { 
    icon: Accessibility, 
    label: t('screenReader'), 
    desc: t('screenReaderDesc') 
  },
  { 
    icon: Contrast, 
    label: t('highContrast'), 
    desc: t('highContrastDesc') 
  },
];

export default function Home() {
  const { t } = useTranslation();
  const features = accessibilityFeatures(t);

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-heading font-extrabold text-2xl text-primary flex items-center gap-2">
              <span className="p-1.5 bg-primary rounded-lg text-white">🗳️</span>
              Vote Saathi
            </span>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">{t('home')}</Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{t('dashboard')}</Link>
              <Link href="/voting-guide" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{t('guide')}</Link>
              <Link href="/candidates" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{t('candidates')}</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-primary"><Globe size={20} /></button>
            <button className="p-2 text-slate-400 hover:text-primary"><Contrast size={20} /></button>
            <button className="p-2 text-slate-400 hover:text-primary"><HelpCircle size={20} /></button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <Link href="/login" className="p-2 text-slate-600 hover:text-primary transition-colors">
              <User size={20} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
            {t('heroTitle').split('.').map((part, i) => (
              <span key={i}>{part}{i === 0 && '.'}<br /></span>
            ))}
          </h1>
          <p className="text-slate-500 text-lg max-w-lg mb-8 leading-relaxed">
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
          className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video lg:aspect-square bg-primary/5"
        >
          {/* Hero Illustration Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-900 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1570126618983-dd752348df3e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40 mix-blend-overlay" />
             <div className="relative text-white/10 text-[20rem] font-bold select-none">INDIA</div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-primary mb-4">{t('accessibilityHeading')}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('accessibilitySub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Bottom Bar */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-slate-400 font-medium tracking-tight">
            {t('footerText')}
          </div>
          <div className="flex gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Use</Link>
            <Link href="#" className="hover:text-primary">Accessibility Statement</Link>
            <Link href="#" className="hover:text-primary">Contact Helpdesk</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
