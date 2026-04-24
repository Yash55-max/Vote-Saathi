'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Globe, MapPin, CheckCircle2,
  ChevronRight, ChevronLeft, HelpCircle
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/store/userStore';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

type Language = 'en' | 'hi' | 'te';

interface Profile {
  age: string;
  language: Language;
  firstTimeVoter: boolean | null;
  locationAllowed: boolean;
}

const LANGUAGES: { code: Language; label: string; native: string; icon: string }[] = [
  { code: 'en', label: 'English',  native: 'English', icon: 'A' },
  { code: 'hi', label: 'Hindi',    native: 'हिंदी',   icon: 'अ' },
  { code: 'te', label: 'Telugu',   native: 'తెలుగు',  icon: 'అ' },
];

const steps = (t: any) => [
  { id: 1, title: t('onboardingAge'), icon: User, sub: t('ageVerificationSub') },
  { id: 2, title: t('onboardingLang'), icon: Globe, sub: t('selectLangSub') },
  { id: 3, title: t('onboardingLoc'), icon: MapPin, sub: t('locationSub') },
  { id: 4, title: t('onboardingVoter'), icon: CheckCircle2, sub: t('voterStatusSub') },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const updateLanguage = useUserStore((state) => state.updateLanguage);
  const currentLang = useUserStore((state) => state.language);
  
  const [step, setStep] = useState(1);
  const onboardingSteps = steps(t);
  const activeStepIdx = step - 1;

  const [profile, setProfile] = useState<Profile>({
    age: '',
    language: currentLang,
    firstTimeVoter: null,
    locationAllowed: false,
  });

  const next = () => {
    if (step < steps.length) setStep(s => s + 1);
    else handleComplete();
  };
  const back = () => setStep(s => s - 1);

  const setProfileStore = useUserStore((state) => state.setProfile);

  const handleComplete = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be signed in to save your profile');
      router.push('/login');
      return;
    }

    const profileData = {
      id: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      age: Number(profile.age),
      language: profile.language,
      voter_status: profile.firstTimeVoter ? 'first_time' : 'returning',
      onboardingComplete: true,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
      setProfileStore(profileData as any);
      toast.success('Onboarding complete!');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Failed to save profile');
    }
  };

  const canProceed = () => {
    if (step === 1) return profile.age !== '' && Number(profile.age) >= 18;
    if (step === 4) return profile.firstTimeVoter !== null;
    return true;
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
        <span className="font-heading font-extrabold text-xl text-primary flex items-center gap-2">
          <span className="p-1 bg-primary rounded text-white text-sm">🗳️</span>
          Vote Saathi
        </span>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-primary">
          <HelpCircle size={18} /> Help
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Progress Section */}
          <div className="p-8 border-b border-slate-50">
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
              {onboardingSteps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                     s.id < step ? 'bg-primary text-white' : 
                     s.id === step ? 'bg-primary text-white border-2 border-primary-100' : 
                     'bg-slate-100 text-slate-400'
                   }`}>
                     {s.id < step ? <CheckCircle2 size={16} /> : s.id}
                   </div>
                   {i < onboardingSteps.length - 1 && (
                     <div className={`h-[2px] w-12 md:w-20 mx-2 ${s.id < step ? 'bg-primary' : 'bg-slate-100'}`} />
                   )}
                </div>
              ))}
            </div>
            <div className="text-center">
               <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Step {step} of 4</span>
               <h2 className="text-2xl font-extrabold text-primary">{onboardingSteps[activeStepIdx].title}</h2>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-12 min-h-[300px]">
             <AnimatePresence mode="wait">
               <motion.div
                 key={step}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="max-w-md mx-auto"
               >
                 {step === 1 && (
                   <div className="text-center">
                     <p className="text-slate-500 mb-8">{onboardingSteps[activeStepIdx].sub}</p>
                     <input
                       type="number"
                       value={profile.age}
                       onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                       placeholder="Enter your age"
                       className="w-full max-w-xs text-3xl font-bold text-center p-4 border-b-4 border-primary focus:outline-none transition-colors"
                     />
                     {profile.age && Number(profile.age) < 18 && (
                        <p className="text-red-500 text-sm mt-4 font-medium">Voters must be at least 18 years old.</p>
                     )}
                   </div>
                 )}

                 {step === 2 && (
                   <div>
                     <p className="text-center text-slate-500 mb-10 leading-relaxed">
                       {onboardingSteps[activeStepIdx].sub}
                     </p>
                     <div className="grid grid-cols-2 gap-4">
                       {LANGUAGES.map(lang => (
                         <button
                           key={lang.code}
                           onClick={() => {
                             setProfile(p => ({ ...p, language: lang.code }));
                             updateLanguage(lang.code);
                           }}
                           className={`p-6 rounded-xl border-2 transition-all text-left flex flex-col gap-4 ${
                             profile.language === lang.code
                               ? 'border-primary bg-primary/5'
                               : 'border-slate-100 hover:border-slate-200'
                           }`}
                         >
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl ${
                             profile.language === lang.code ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                           }`}>
                             {lang.icon}
                           </div>
                           <div>
                             <div className={`font-bold ${profile.language === lang.code ? 'text-primary' : 'text-slate-600'}`}>
                               {lang.label}
                             </div>
                             <div className="text-xs text-slate-400">{lang.native}</div>
                           </div>
                         </button>
                       ))}
                       <button className="p-6 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                         <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                           +
                         </div>
                       </button>
                     </div>
                   </div>
                 )}

                 {step === 3 && (
                   <div className="text-center">
                     <p className="text-slate-500 mb-10">{onboardingSteps[activeStepIdx].sub}</p>
                     <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                       <MapPin size={40} className="text-primary" />
                     </div>
                     <button
                       onClick={() => { setProfile(p => ({ ...p, locationAllowed: true })); next(); }}
                       className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all"
                     >
                       Allow Location Access
                     </button>
                   </div>
                 )}

                 {step === 4 && (
                   <div>
                     <p className="text-center text-slate-500 mb-10">{onboardingSteps[activeStepIdx].sub}</p>
                     <div className="space-y-4">
                        {[
                          { val: true, label: 'First-time Voter', desc: "This is my first time voting in a general election." },
                          { val: false, label: 'Experienced Voter', desc: "I have voted in previous elections." }
                        ].map(opt => (
                          <button
                            key={String(opt.val)}
                            onClick={() => setProfile(p => ({ ...p, firstTimeVoter: opt.val }))}
                            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                              profile.firstTimeVoter === opt.val
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            <div className="font-bold text-primary mb-1">{opt.label}</div>
                            <div className="text-xs text-slate-400">{opt.desc}</div>
                          </button>
                        ))}
                     </div>
                   </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="p-8 bg-slate-50 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={back}
              disabled={step === 1}
              className="px-6 py-2 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary disabled:opacity-0 transition-all"
            >
              <ChevronLeft size={18} /> {t('back')}
            </button>
            <button
              onClick={next}
              disabled={!canProceed()}
              className="px-10 py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {step === onboardingSteps.length ? t('getStarted') : t('continue')}
            </button>
          </div>
        </div>
      </div>

      <footer className="p-6 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
        {t('footerText')}
      </footer>
    </main>
  );
}
