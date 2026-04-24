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
import toast from 'react-hot-toast';

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

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const setProfile = useUserStore(state => state.setProfile);
  const features = accessibilityFeatures(t);

  const handleDemoAccess = () => {
    const demoProfile = {
      id: 'demo-judge',
      name: 'Judge Evaluation',
      email: 'judge@hackathon.com',
      age: 28,
      language: 'en' as const,
      constituency: 'Kakinada',
      state: 'Andhra Pradesh',
      formatted_address: 'Kakinada, Andhra Pradesh, India',
      voter_status: 'returning' as const,
      voterType: 'Experienced' as const,
      onboardingComplete: true,
      booths: [
        {
          id: 101,
          name: 'Z.P. High School, Main Branch',
          address: 'Room No. 3, Ward 12, Kakinada',
          lat: 16.9891,
          lng: 82.2475
        }
      ]
    };
    
    setProfile(demoProfile);
    router.push('/dashboard');
    toast.success('Entering Demo Mode');
  };

  return (
    <main className="min-h-screen bg-background text-text">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-surface border-b border-surface-2">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-heading font-extrabold text-2xl text-primary flex items-center gap-2">
              <span className="p-1.5 bg-primary rounded-lg text-white">🗳️</span>
              Vote Saathi
            </span>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">{t('home')}</Link>
              <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-primary transition-colors">{t('dashboard')}</Link>
              <Link href="/voting-guide" className="text-sm font-medium text-muted hover:text-primary transition-colors">{t('guide')}</Link>
              <Link href="/candidates" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{t('candidates')}</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted hover:text-primary"><Globe size={20} /></button>
            <button className="p-2 text-muted hover:text-primary"><Contrast size={20} /></button>
            <button className="p-2 text-muted hover:text-primary"><HelpCircle size={20} /></button>
            <div className="h-6 w-[1px] bg-surface-2 mx-2" />
            <Link href="/login" className="p-2 text-muted hover:text-primary transition-colors">
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

      {/* Feature Grid */}
      <section className="bg-surface-2 py-24 px-6 border-y border-surface-2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-primary mb-4">{t('accessibilityHeading')}</h2>
            <p className="text-muted max-w-2xl mx-auto">
              {t('accessibilitySub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface p-8 rounded-xl border border-surface-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.label}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Judge's Showcase / Demo Section */}
          <div className="pt-24 border-t border-surface-2">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1">
                   <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-surface shadow-primary/10">
                      <img 
                        src="/votesaathi_dashboard_preview.png" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000";
                        }}
                        alt="VoteSaathi Dashboard Preview"
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                   </div>
                </div>
                
                <div className="order-1 lg:order-2 space-y-8">
                   <div>
                      <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                         Judge's Showcase
                      </span>
                      <h2 className="text-4xl font-black text-primary leading-tight">
                         Evaluate the <span className="text-accent">Saathi Experience</span> Without Logging In.
                      </h2>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                         <div>
                            <h4 className="font-bold text-primary text-sm mb-1">AI-Powered Election Assistant</h4>
                            <p className="text-xs text-muted">A context-aware chatbot that understands local languages and provides authoritative voting guidance.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                         <div>
                            <h4 className="font-bold text-primary text-sm mb-1">Real-Time Constituency Mapping</h4>
                            <p className="text-xs text-muted">Integrated Google Maps API for precise polling booth detection and multi-marker visual navigation.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                         <div>
                            <h4 className="font-bold text-primary text-sm mb-1">Universal Accessibility Engine</h4>
                            <p className="text-xs text-muted">Theme-aware UI supporting High Contrast, Dyslexia-friendly fonts, and semantic screen reader structures.</p>
                         </div>
                      </div>
                   </div>
                   <div className="pt-4 flex flex-wrap gap-4">
                      <Link href="/login" className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all">
                         Launch Platform
                      </Link>
                      <button 
                        onClick={handleDemoAccess}
                        className="px-6 py-3 bg-accent text-white rounded-xl font-bold text-sm shadow-lg shadow-accent/20 hover:bg-accent-700 transition-all"
                      >
                         View Live Demo
                      </button>
                      <button className="px-6 py-3 bg-surface border border-surface-2 text-primary rounded-xl font-bold text-sm hover:border-primary/20 transition-all">
                         Architecture
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer / Bottom Bar */}
      <footer className="py-12 px-6 border-t border-surface-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-muted font-medium tracking-tight">
            {t('footerText')}
          </div>
          <div className="flex gap-6 text-xs text-muted font-bold uppercase tracking-widest">
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
