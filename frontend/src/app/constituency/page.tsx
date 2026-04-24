'use client';

import { useState, useEffect, useRef } from 'react';
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
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ConstituencyPage() {
  const { t } = useTranslation();
  const profile = useUserStore(state => state.profile);
  const [locating, setLocating] = useState(false);
  const [constituencyData, setConstituencyData] = useState<any>(null);
  const [booths, setBooths] = useState<any[]>([]);

  const setProfileStore = useUserStore(state => state.setProfile);

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
        
        // Sync with Profile if logged in
        if (profile?.id) {
          const updatedProfile = {
            ...profile,
            constituency: data.constituency,
            state: data.state,
            formatted_address: data.formatted_address,
            booths: data.booths || []
          };
          await setDoc(doc(db, 'users', profile.id), updatedProfile, { merge: true });
          setProfileStore(updatedProfile as any);
        }

        toast.success('Location identified & Profile updated');
      } catch (err) {
        toast.error('Failed to identify location');
        console.error(err);
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

  return (
    <div className="min-h-screen bg-background flex flex-col text-text">
      {/* Navbar */}
      <nav className="h-16 bg-surface border-b border-surface-2 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-heading font-extrabold text-xl text-primary flex items-center gap-2">
            <span className="p-1 bg-primary rounded text-white text-xs">🗳️</span>
            Vote Saathi
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted hover:text-primary transition-colors">Home</Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/voting-guide" className="text-sm font-medium text-muted hover:text-primary transition-colors">Guide</Link>
            <Link href="/candidates" className="text-sm font-medium text-muted hover:text-primary transition-colors">Candidates</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-2 text-muted hover:text-primary"><Search size={20} /></button>
           <button className="p-2 text-muted hover:text-primary"><Globe size={20} /></button>
           <button className="p-2 text-muted hover:text-primary"><HelpCircle size={20} /></button>
        </div>
      </nav>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center md:text-left"
        >
          <h1 className="text-3xl font-extrabold text-primary mb-2">Your Constituency Map</h1>
          <p className="text-muted max-w-2xl mx-auto md:mx-0">
            Locate your designated polling booth, view navigation routes, and verify local election jurisdiction boundaries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-surface rounded-3xl border border-surface-2 shadow-xl shadow-slate-200/40 overflow-hidden relative">
             {!constituencyData && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                   <button 
                    onClick={handleLocate}
                    disabled={locating}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3"
                   >
                     {locating ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Navigation size={20} />}
                     Locate My Constituency
                   </button>
                </div>
             )}
             <div className="absolute top-6 left-6 z-10 flex gap-2">
                <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center gap-2 text-xs font-bold text-primary border border-slate-100">
                   <div className="w-2 h-2 rounded-full bg-orange-500" /> {t('yourBooth')}
                </div>
                <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center gap-2 text-xs font-bold text-slate-400 border border-slate-100">
                   <div className="w-2 h-2 rounded-full bg-slate-300" /> {t('otherBooths')}
                </div>
             </div>
             
             {/* Map Content */}
             <div className="h-[600px] bg-slate-900 relative flex items-center justify-center overflow-hidden">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (constituencyData || profile?.booths?.length) ? (
                  <MapWithMarkers 
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    booths={booths.length > 0 ? booths : (profile?.booths || [])}
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000')] bg-cover grayscale invert" />
                    {constituencyData && (
                      <div className="relative">
                        <div className="absolute top-[-40px] left-[-20px]">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/40 animate-bounce">
                              <MapPin size={24} />
                            </div>
                            <div className="bg-surface/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-primary mt-2 whitespace-nowrap shadow-md">
                              {booths[0]?.name || 'Your Assigned Booth'}
                            </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Map Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
                   <button className="w-10 h-10 bg-surface rounded-xl shadow-lg flex items-center justify-center text-muted font-bold hover:text-primary">+</button>
                   <button className="w-10 h-10 bg-surface rounded-xl shadow-lg flex items-center justify-center text-muted font-bold hover:text-primary">-</button>
                   <button onClick={handleLocate} className="w-10 h-10 bg-surface rounded-xl shadow-lg flex items-center justify-center text-primary"><Navigation size={18} /></button>
                </div>
             </div>
          </div>

          {/* Details Section */}
           <div className="space-y-6">
              <div className="bg-surface rounded-3xl border border-surface-2 shadow-xl shadow-slate-200/40 p-8">
                 <div className="flex items-start justify-between mb-8">
                    <div>
                       <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 block">{t('parliamentaryConstituency')}</span>
                       <h2 className="text-2xl font-extrabold text-primary">{constituencyData?.constituency || profile?.constituency || 'Pending...'}</h2>
                    </div>
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                       <Building2 size={24} />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{t('phase')}</p>
                       <p className="font-extrabold text-primary">{constituencyData?.state || profile?.state || 'N/A'}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{t('pollingDate')}</p>
                       <p className="font-extrabold text-primary">TBD</p>
                    </div>
                 </div>
              </div>

              <div className="bg-surface rounded-3xl border border-surface-2 shadow-xl shadow-slate-200/40 p-8">
                 <h3 className="font-extrabold text-primary mb-6 flex items-center gap-2">
                    {t('nearbyBooths')}
                    <span className="bg-primary/5 text-primary text-[10px] px-2 py-1 rounded-full">{booths.length || profile?.booths?.length || 0}</span>
                 </h3>
                 <div className="space-y-6">
                    {(booths.length > 0 ? booths : profile?.booths || []).map((booth: any, i: number) => (
                      <div key={booth.id} className="flex gap-4 group cursor-pointer">
                         <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              i === 0 ? 'bg-orange-500 text-white' : 'bg-surface-2 text-muted'
                            }`}>
                              {i + 1}
                            </div>
                            {i < ((booths.length > 0 ? booths : profile?.booths || []).length - 1) && <div className="w-[2px] flex-1 bg-surface-2 mt-2" />}
                         </div>
                         <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-primary text-sm group-hover:text-primary/70">{booth.name}</h4>
                               {i === 0 && (
                                 <span className="text-[8px] font-black uppercase tracking-tighter bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{t('yourBooth')}</span>
                               )}
                            </div>
                            <p className="text-muted text-[10px] leading-relaxed mb-3">{booth.address}</p>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{booth.distance || 'Near'}</span>
                               <span className="text-[10px] font-bold text-muted group-hover:text-primary flex items-center gap-1">{t('getDirections')} <ChevronRight size={12} /></span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Official Assistance */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-surface border border-surface-2 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
              <HelpCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-primary mb-1">Need Official Assistance?</h3>
              <p className="text-muted text-sm">For any discrepancy in booth details or registration, contact the ECI helplines.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <a 
              href="tel:1950" 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all text-sm"
            >
              Call 1950
            </a>
            <a 
              href="https://voters.eci.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-surface-2 text-primary rounded-xl font-bold border border-surface-2 hover:border-primary/20 transition-all text-sm"
            >
              Voter Portal
            </a>
          </div>
        </div>
      </div>

      <footer className="p-8 text-center bg-surface border-t border-surface-2">
        <Link href="/dashboard" className="inline-block bg-primary text-white px-12 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 transition-all">
          {t('backToDashboard')}
        </Link>
      </footer>
    </div>
  );
}

// ─── Custom Google Map with Multi-Markers ────────────────────

function MapWithMarkers({ apiKey, booths }: { apiKey: string, booths: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !booths.length) return;

    // 1. Load Google Maps Script
    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!window.google || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: { lat: booths[0].lat, lng: booths[0].lng },
        disableDefaultUI: true,
        styles: [
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }]
          }
        ]
      });

      const bounds = new window.google.maps.LatLngBounds();

      booths.forEach((booth, i) => {
        if (!booth.lat || !booth.lng) return;
        
        const marker = new window.google.maps.Marker({
          position: { lat: booth.lat, lng: booth.lng },
          map,
          title: booth.name,
          icon: i === 0 
            ? 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png' 
            : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          animation: i === 0 ? window.google.maps.Animation.BOUNCE : null
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color: #1e293b; padding: 4px;">
                      <div style="font-weight: bold; font-size: 12px; margin-bottom: 2px;">${booth.name}</div>
                      <div style="font-size: 10px; opacity: 0.8;">${booth.address}</div>
                    </div>`
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        bounds.extend(marker.getPosition()!);
      });

      if (booths.length > 1) {
        map.fitBounds(bounds);
      }
    }
  }, [apiKey, booths]);

  return <div ref={mapRef} className="w-full h-full" />;
}

declare global {
  interface Window {
    google: any;
  }
}
