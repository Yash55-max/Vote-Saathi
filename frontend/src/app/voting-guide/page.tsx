'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  FileText,
  UserCheck,
  Building2,
  Fingerprint,
  Vote
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Check Your Voter Registration',
    desc: 'Before election day, ensure your name appears on the official electoral roll. You can easily search for your name online using your details or EPIC number.',
    icon: UserCheck,
    footer: 'Online verification takes 2 minutes',
    footerIcon: Clock
  },
  {
    id: 2,
    title: 'Locate Your Polling Station',
    desc: 'Find out exactly where you need to go to cast your vote. Your assigned polling booth is usually located in a school or public building near your residence.',
    icon: MapPin,
    footer: 'Find your assigned booth on the map',
    footerIcon: Search
  },
  {
    id: 3,
    title: 'Bring Valid Identification',
    desc: 'You must prove your identity before voting. Carry your Voter ID Card (EPIC). If you do not have it, bring an approved alternative like an Aadhaar Card or Passport.',
    icon: FileText,
    footer: 'Original ID proof is mandatory',
    footerIcon: Shield
  },
  {
    id: 4,
    title: 'Cast Your Vote Securely',
    desc: 'At the booth, an official will verify your ID and mark your finger with ink. Proceed to the Electronic Voting Machine (EVM) and press the blue button next to your chosen candidate.',
    icon: Fingerprint,
    footer: 'Wait for the beep sound to confirm',
    footerIcon: Clock
  }
];

function Shield({ size, className }: { size?: number, className?: string }) {
  return <FileText size={size} className={className} />;
}

export default function VotingGuidePage() {
  const { t } = useTranslation();
  
  const localizedSteps = [
    {
      id: 1,
      title: t('guideStep1Title') || 'Check Your Voter Registration',
      desc: t('guideStep1Desc') || 'Before election day, ensure your name appears on the official electoral roll.',
      icon: UserCheck,
      footer: t('guideStep1Footer') || 'Online verification takes 2 minutes',
      footerIcon: Clock
    },
    {
      id: 2,
      title: t('guideStep2Title') || 'Locate Your Polling Station',
      desc: t('guideStep2Desc') || 'Find out exactly where you need to go to cast your vote.',
      icon: MapPin,
      footer: t('guideStep2Footer') || 'Find your assigned booth on the map',
      footerIcon: Search
    },
    {
      id: 3,
      title: t('guideStep3Title') || 'Bring Valid Identification',
      desc: t('guideStep3Desc') || 'You must prove your identity before voting. Carry your Voter ID Card (EPIC).',
      icon: FileText,
      footer: t('guideStep3Footer') || 'Original ID proof is mandatory',
      footerIcon: FileText
    },
    {
      id: 4,
      title: t('guideStep4Title') || 'Cast Your Vote Securely',
      desc: t('guideStep4Desc') || 'At the booth, an official will verify your ID and mark your finger with ink.',
      icon: Fingerprint,
      footer: t('guideStep4Footer') || 'Wait for the beep sound to confirm',
      footerIcon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-heading font-extrabold text-xl text-primary flex items-center gap-2">
            <span className="p-1 bg-primary rounded text-white text-xs">🗳️</span>
            Vote Saathi
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{t('home')}</Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{t('dashboard')}</Link>
            <Link href="/voting-guide" className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">{t('guide')}</Link>
            <Link href="/candidates" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{t('candidates')}</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
             <UserCheck size={18} />
           </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-extrabold text-primary mb-4 text-center md:text-left">{t('guideHeading') || 'Step-by-Step Voting Guide'}</h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl text-center md:text-left">
            {t('guideSub') || 'Follow these simple steps to cast your vote confidently.'}
          </p>
        </motion.div>

        <div className="space-y-8">
          {localizedSteps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 md:gap-10"
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20">
                  {step.id}
                </div>
                {i < localizedSteps.length - 1 && (
                  <div className="w-1 flex-1 bg-slate-100 my-4 rounded-full" />
                )}
              </div>
              
              <div className="flex-1 pb-12">
                <h2 className="text-2xl font-bold text-primary mb-3">{step.title}</h2>
                <p className="text-slate-500 leading-relaxed mb-6">
                  {step.desc}
                </p>
                <div className="flex items-center gap-2 text-accent font-bold text-sm">
                  <step.footerIcon size={16} />
                  {step.footer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                 <Vote size={24} />
              </div>
              <div>
                 <h4 className="font-bold text-primary">{t('readyToVote') || 'Ready to cast your vote?'}</h4>
                 <p className="text-slate-400 text-sm">{t('checkBoothToday') || 'Check your booth and candidates today.'}</p>
              </div>
           </div>
           <Link href="/dashboard" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all">
             {t('backToDashboard') || 'Back to Dashboard'}
           </Link>
        </div>
      </div>

      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            © 2024 ELECTION COMMISSION OF INDIA. DESIGNED FOR DEMOCRATIC ACCESSIBILITY.
          </div>
          <div className="flex gap-6 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Use</Link>
            <Link href="#" className="hover:text-primary">Accessibility Statement</Link>
            <Link href="#" className="hover:text-primary">Contact Helpdesk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
