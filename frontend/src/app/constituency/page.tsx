'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Calendar, 
  Users,
  Search,
  ChevronRight,
  Globe,
  Settings,
  HelpCircle,
  Building2
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';

export default function ConstituencyPage() {
  const { t } = useTranslation();
  const profile = useUserStore(state => state.profile);
  const [locating, setLocating] = useState(false);
  const [constituencyData, setConstituencyData] = useState<any>(null);
  const [booths, setBooths] = useState<any[]>([]);

  const handleLocate = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch('http://localhost:8000/api/constituency', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latitude, lng: longitude })
        });
        const data = await res.json();
        setConstituencyData(data);
        setBooths(data.booths || []);
        toast.success('Location identified');
      } catch (err) {
        toast.error('Failed to identify location');
      } finally {
        setLocating(false);
      }
    }, () => {
      toast.error('Location permission denied');
      setLocating(false);
    });
  };

  useEffect(() => {
    // If user already has location from profile, we could auto-load, 
    // but better to let them trigger it for precision.
  }, []);
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-heading font-extrabold text-xl text-primary flex items-center gap-2">
            <span className="p-1 bg-primary rounded text-white text-xs">🗳️</span>
            Vote Saathi
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Home</Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/voting-guide" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Guide</Link>
            <Link href="/candidates" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Candidates</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-2 text-slate-400 hover:text-primary"><Search size={20} /></button>
           <button className="p-2 text-slate-400 hover:text-primary"><Globe size={20} /></button>
           <button className="p-2 text-slate-400 hover:text-primary"><HelpCircle size={20} /></button>
        </div>
      </nav>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center md:text-left"
        >
          <h1 className="text-3xl font-extrabold text-primary mb-2">Your Constituency Map</h1>
          <p className="text-slate-500 max-w-2xl">
            Locate your designated polling booth, view navigation routes, and verify local election jurisdiction boundaries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
             <div className="absolute top-6 left-6 z-10 flex gap-2">
                <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center gap-2 text-xs font-bold text-primary border border-slate-100">
                   <div className="w-2 h-2 rounded-full bg-orange-500" /> Your Booth
                </div>
                <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center gap-2 text-xs font-bold text-slate-400 border border-slate-100">
                   <div className="w-2 h-2 rounded-full bg-slate-300" /> Other Booths
                </div>
             </div>
             
             {/* Map Placeholder */}
             <div className="h-[600px] bg-slate-900 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000')] bg-cover grayscale invert" />
                <div className="relative">
                   {/* Mock pins */}
                   <div className="absolute top-[-40px] left-[-20px]">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/40 animate-bounce">
                         <MapPin size={24} />
                      </div>
                      <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-primary mt-2 whitespace-nowrap shadow-md">
                         Govt. Senior Secondary School
                      </div>
                   </div>
                   <div className="absolute top-[80px] left-[100px]">
                      <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white" />
                   </div>
                   <div className="absolute top-[-100px] left-[-150px]">
                      <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white" />
                   </div>
                </div>
                
                {/* Map Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                   <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-400 font-bold">+</button>
                   <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-400 font-bold">-</button>
                   <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary"><Navigation size={18} /></button>
                </div>
             </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
             <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                <div className="flex items-start justify-between mb-8">
                   <div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1 block">Parliamentary Constituency</span>
                      <h2 className="text-2xl font-extrabold text-primary">New Delhi</h2>
                   </div>
                   <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                      <Building2 size={24} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Phase</p>
                      <p className="font-extrabold text-primary">Phase 6</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Polling Date</p>
                      <p className="font-extrabold text-primary">25 May</p>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50">
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Assembly Constituency</p>
                   <p className="font-extrabold text-primary">AC-40, New Delhi</p>
                </div>
             </div>

             <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                <h3 className="font-extrabold text-primary mb-6 flex items-center gap-2">
                   Polling Booths Near You
                   <span className="bg-primary/5 text-primary text-[10px] px-2 py-1 rounded-full">{MOCK_BOOTHS.length}</span>
                </h3>
                <div className="space-y-6">
                   {MOCK_BOOTHS.map((booth, i) => (
                     <div key={booth.id} className="flex gap-4 group cursor-pointer">
                        <div className="flex flex-col items-center">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                             booth.assigned ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'
                           }`}>
                             {i + 1}
                           </div>
                           {i < MOCK_BOOTHS.length - 1 && <div className="w-[2px] flex-1 bg-slate-50 mt-2" />}
                        </div>
                        <div className="flex-1 pb-4">
                           <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-primary text-sm group-hover:text-primary/70">{booth.name}</h4>
                              {booth.assigned && (
                                <span className="text-[8px] font-black uppercase tracking-tighter bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Your Assigned Booth</span>
                              )}
                           </div>
                           <p className="text-slate-400 text-[10px] leading-relaxed mb-3">{booth.address}</p>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{booth.distance}</span>
                              <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary flex items-center gap-1">Get Directions <ChevronRight size={12} /></span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      <footer className="p-8 text-center bg-white border-t border-slate-100">
        <button className="bg-primary text-white px-12 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-primary-700 transition-all">
          Check Voter Status
        </button>
      </footer>
    </div>
  );
}

function Building2({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}
