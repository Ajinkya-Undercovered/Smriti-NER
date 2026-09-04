import React from 'react';
import { Menu, Stethoscope, Brain, HeartPulse, Wind, Home, Volume2, UserCheck } from 'lucide-react';
import { usePatient } from '../context/PatientContext.jsx';
import { DualAudioToggle } from './common/DualAudioToggle.jsx';
import { NetworkStatusBanner } from './common/NetworkStatusBanner.jsx';
import { InstallPwaButton } from './common/InstallPwaButton.jsx';

export const Header = ({ activeTab, setActiveTab, onOpenDrawer, onDoctorClick }) => {
  const { patient, t, currentUser } = usePatient();

  const roleLabels = {
    patient: { badge: '👴 Senior Patient', color: 'bg-rose-100 text-rose-900 border-rose-200' },
    caregiver: { badge: '👩‍⚕️ Caregiver Portal', color: 'bg-teal-100 text-teal-950 border-teal-300' },
    asha_worker: { badge: '🩺 ASHA Field Portal', color: 'bg-orange-100 text-orange-950 border-orange-300' }
  };

  const roleMeta = roleLabels[currentUser?.role] || roleLabels.patient;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-2 border-rose-200 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-3 flex items-center justify-between gap-3">
        
        {/* Brand & Home Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-200 transition-colors cursor-pointer"
            title="Accessibility, Roles & Settings"
            aria-label="Open settings menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo / Brand / Home Return */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            title="Go to Home Hub"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-2xl shadow-xs text-white font-bold group-hover:scale-105 transition-transform">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                  {t.appTitle || 'Smriti-NER'}
                </h1>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${roleMeta.color}`}>
                  {roleMeta.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {currentUser?.name || patient.name} • {patient.location}
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Install App + Network Status + Dual Audio + Shortcuts */}
        <div className="flex items-center gap-2">
          <InstallPwaButton />
          <NetworkStatusBanner />
          <DualAudioToggle />

          {/* Home Button (Always visible when navigated away) */}
          {activeTab !== 'home' && (
            <button
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform active:scale-95"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home (ঘৰলৈ)</span>
            </button>
          )}

          {/* Doctor Modal Shortcut */}
          <button
            onClick={onDoctorClick}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Doctor & Healthcare Info"
          >
            <Stethoscope className="w-4 h-4 text-amber-700" />
            <span className="hidden md:inline">Doctor</span>
          </button>
        </div>

      </div>
    </header>
  );
};
