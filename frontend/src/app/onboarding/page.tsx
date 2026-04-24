'use client';

import { useState, useEffect } from 'react';
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

import { Language } from '@/types';

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
  { code: 'ta', label: 'Tamil',    native: 'தமிழ்',   icon: 'அ' },
  { code: 'kn', label: 'Kannada',  native: 'ಕನ್ನಡ',   icon: 'ಅ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', icon: 'അ' },
  { code: 'mr', label: 'Marathi',  native: 'मराठी',   icon: 'अ' },
  { code: 'bn', label: 'Bengali',  native: 'বাংলা',   icon: 'অ' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', icon: 'અ' },
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
  const profileStore = useUserStore((state) => state.profile);
  const updateLanguage = useUserStore((state) => state.updateLanguage);
  const currentLang = useUserStore((state) => state.language);
  
  useEffect(() => {
    if (profileStore?.onboardingComplete) {
      router.push('/dashboard');
    }
  }, [profileStore, router]);

  const [step, setStep] = useState(1);
  const onboardingSteps = steps(t);
  const activeStepIdx = step - 1;

  const [profile, setProfile] = useState<Profile>({
    age: '',
    language: currentLang,
    firstTimeVoter: null,
    locationAllowed: false,
  });

  const [detecting, setDetecting] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/constituency`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          });
          const data = await res.json();
          setLocationData(data);
          setProfile(p => ({ ...p, locationAllowed: true }));
          toast.success(`Located: ${data.constituency}`);
        } catch (err) {
          console.error(err);
          toast.error("Failed to detect constituency");
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        toast.error("Location access denied");
      }
    );
  };

  const next = () => {
    if (step < onboardingSteps.length) setStep(s => s + 1);
    else handleComplete();
  };
  const back = () => setStep(s => s - 1);

  const setProfileStore = useUserStore((state) => state.setProfile);

  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be signed in to save your profile');
      router.push('/login');
      return;
    }

    setCompleting(true);
    const profileData = {
      id: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      age: Number(profile.age),
      language: profile.language,
      voter_status: profile.firstTimeVoter ? 'first_time' : 'returning' as const,
      voterType: profile.firstTimeVoter ? 'First Time' : 'Experienced' as const,
      onboardingComplete: true,
      constituency: locationData?.constituency || '',
      state: locationData?.state || '',
      formatted_address: locationData?.formatted_address || '',
      booths: locationData?.booths || [],
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
      setProfileStore(profileData as any);
      toast.success('Onboarding complete!');
      router.push('/dashboard');
    } catch (err) {
      console.error("Firestore Save Error:", err);
      toast.error('Failed to save profile. Check Firestore rules.');
    } finally {
      setCompleting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return profile.age !== '' && Number(profile.age) >= 18;
    if (step === 4) return profile.firstTimeVoter !== null;
    return true;
  };

  return (
    <main className="min-h-screen bg-background flex flex-col text-text">
      {/* Top Header */}
      <header className="h-16 bg-surface border-b border-surface-2 flex items-center justify-between px-6">
        <span className="font-heading font-extrabold text-xl text-primary flex items-center gap-2">
          <span className="p-1 bg-primary rounded text-white text-sm">🗳️</span>
          Vote Saathi
        </span>
        <button className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary">
          <HelpCircle size={18} /> {t('help')}
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-surface rounded-2xl shadow-xl shadow-slate-200/50 border border-surface-2 overflow-hidden">
          {/* Progress Section */}
          <div className="p-8 border-b border-surface-2">
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
              {onboardingSteps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      s.id < step ? 'bg-primary text-white' : 
                      s.id === step ? 'bg-primary text-white ring-4 ring-primary/20' : 
                      'bg-surface-2 text-muted'
                    }`}>
                     {s.id < step ? <CheckCircle2 size={16} /> : s.id}
                   </div>
                    {i < onboardingSteps.length - 1 && (
                      <div className={`h-[2px] w-12 md:w-20 mx-2 ${s.id < step ? 'bg-primary' : 'bg-surface-2'}`} />
                    )}
                </div>
              ))}
            </div>
            <div className="text-center">
               <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">{t('step')} {step} {t('of')} 4</span>
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
                      <p className="text-muted mb-8">{onboardingSteps[activeStepIdx].sub}</p>
                     <input
                       type="number"
                       value={profile.age}
                       onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                        placeholder={t('enterAge')}
                        className="w-full max-w-xs text-3xl font-bold text-center p-4 border-b-4 border-primary bg-transparent focus:outline-none transition-colors"
                      />
                     {profile.age && Number(profile.age) < 18 && (
                        <p className="text-red-500 text-sm mt-4 font-medium">Voters must be at least 18 years old.</p>
                     )}
                   </div>
                 )}

                  {step === 2 && (
                    <div>
                      <p className="text-center text-muted mb-10 leading-relaxed">
                        {onboardingSteps[activeStepIdx].sub}
                      </p>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                                : 'border-surface-2 hover:border-slate-200'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl ${
                              profile.language === lang.code ? 'bg-primary text-white' : 'bg-surface-2 text-muted'
                            }`}>
                              {lang.icon}
                            </div>
                            <div>
                              <div className={`font-bold ${profile.language === lang.code ? 'text-primary' : 'text-text'}`}>
                                {lang.label}
                              </div>
                              <div className="text-xs text-muted">{lang.native}</div>
                            </div>
                         </button>
                       ))}
                        <button className="p-6 rounded-xl border-2 border-dashed border-surface-2 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-muted">
                            +
                          </div>
                        </button>
                     </div>
                   </div>
                 )}

                  {step === 3 && (
                    <div className="text-center">
                      <p className="text-muted mb-10">{onboardingSteps[activeStepIdx].sub}</p>
                      {locationData ? (
                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mb-8 animate-fade-in">
                          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                            <div className="w-full h-32 rounded-xl mb-6 overflow-hidden border border-primary/10 shadow-inner">
                              <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(locationData.formatted_address)}&zoom=12`}
                              />
                            </div>
                          )}
                          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                              <MapPin size={24} />
                            </div>
                          )}
                          <h3 className="font-bold text-primary text-xl mb-1">{locationData.constituency}</h3>
                          <p className="text-muted text-sm mb-4">{locationData.formatted_address}</p>
                          
                          <div className="text-left space-y-3">
                             <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Nearby Polling Booths</p>
                             {locationData.booths?.slice(0, 2).map((b: any) => (
                               <div key={b.id} className="bg-surface p-3 rounded-lg border border-surface-2 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-surface-2 flex items-center justify-center text-primary font-bold text-xs">
                                    {b.name[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <div className="text-xs font-bold truncate">{b.name}</div>
                                     <div className="text-[10px] text-muted truncate">{b.address}</div>
                                  </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                          <MapPin size={40} className={`text-primary ${detecting ? 'animate-bounce' : ''}`} />
                        </div>
                      )}
                      {!locationData ? (
                        <button
                          onClick={detectLocation}
                          disabled={detecting}
                          className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all disabled:opacity-50"
                        >
                          {detecting ? 'Detecting...' : t('allowLocation')}
                        </button>
                      ) : (
                        <button
                          onClick={next}
                          className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all"
                        >
                          {t('continue')}
                        </button>
                      )}
                   </div>
                 )}

                 {step === 4 && (
                   <div>
                     <p className="text-center text-slate-500 mb-10">{onboardingSteps[activeStepIdx].sub}</p>
                     <div className="space-y-4">
                        {[
                          { val: true, label: t('firstTimeVoterLabel'), desc: t('firstTimeVoterDesc') },
                          { val: false, label: t('experiencedVoterLabel'), desc: t('experiencedVoterDesc') }
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
              disabled={!canProceed() || completing}
              className="px-10 py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all disabled:opacity-50 disabled:shadow-none min-w-[140px]"
            >
              {completing ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              ) : (
                step === onboardingSteps.length ? t('getStarted') : t('continue')
              )}
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
