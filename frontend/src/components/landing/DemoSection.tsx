'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';

interface DemoSectionProps {
  t: (key: string) => string;
}

const DemoSection: React.FC<DemoSectionProps> = ({ t }) => {
  const router = useRouter();
  const setProfile = useUserStore(state => state.setProfile);

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
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
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
                {[
                  { id: 1, title: 'AI-Powered Election Assistant', desc: 'A context-aware chatbot that understands local languages and provides authoritative voting guidance.' },
                  { id: 2, title: 'Real-Time Constituency Mapping', desc: 'Integrated Google Maps API for precise polling booth detection and multi-marker visual navigation.' },
                  { id: 3, title: 'Universal Accessibility Engine', desc: 'Theme-aware UI supporting High Contrast, Dyslexia-friendly fonts, and semantic screen reader structures.' }
                ].map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">{item.id}</div>
                    <div>
                      <h4 className="font-bold text-primary text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
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
  );
};

export default DemoSection;
