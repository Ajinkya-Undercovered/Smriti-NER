import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { SUPPORTED_LANGUAGES } from '../../types/index.js';
import { speechService } from '../../i18n/speechService.js';
import { 
  Mic, 
  AlertTriangle, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  Globe
} from 'lucide-react';

export const Header = () => {
  const { 
    patient, 
    language, 
    setLanguage, 
    highContrast, 
    setHighContrast, 
    isOffline, 
    t, 
    setIsVoiceOpen, 
    setIsSosOpen 
  } = usePatient();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-amber-200 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
        
        {/* Brand & Regional Badge */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-2xl shadow-sm text-white font-bold">
            🌿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                {t.appTitle}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 hidden md:inline-flex">
                  NER Care (উত্তৰ-পূব)
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block truncate max-w-xs md:max-w-md font-medium">
              {patient.regionalName || patient.name} • {patient.location}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Offline / Online Sync Indicator */}
          <div 
            title={isOffline ? t.offlineStatus : t.onlineStatus}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isOffline 
                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            {isOffline ? <WifiOff size={13} className="text-amber-600" /> : <Wifi size={13} className="text-emerald-600" />}
            <span className="hidden lg:inline">{isOffline ? 'Offline' : 'Online Sync'}</span>
          </div>

          {/* Multilingual Selector */}
          <div className="relative flex items-center">
            <Globe size={16} className="text-slate-400 absolute left-2 pointer-events-none" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="pl-7 pr-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-400 focus:outline-hidden cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.englishName})
                </option>
              ))}
            </select>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="Toggle High Contrast Mode"
          >
            {highContrast ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-600" />}
          </button>

          {/* Live Voice Assistant Mic Button */}
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 animate-pulse cursor-pointer"
            title="Voice Assistant"
          >
            <Mic size={16} className="text-amber-200" />
            <span className="hidden sm:inline">{t.voiceAssistant}</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={() => setIsSosOpen(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
            title="Emergency SOS"
          >
            <AlertTriangle size={16} className="text-amber-200" />
            <span>SOS</span>
          </button>

        </div>
      </div>
    </header>
  );
};
